/* global fetch */

const { styleText } = require('util');

const MAX_CHANGE_PERCENT = 10;

// Logging helpers matching @weco/common/utils/console-logs conventions
function logInfo(message) {
  console.log(styleText('blue', `==> ${message}`));
}

function logSuccess(message) {
  console.log(styleText('green', `✓ ${message}`));
}

function logError(message) {
  console.error(styleText('red', `✗ ${message}`));
}

/**
 * Extract IPv4 addresses from Google's JSON format
 * Expected format: { prefixes: [{ ipv4Prefix: "66.249.64.0/19" }, { ipv6Prefix: "..." }] }
 */
function extractIpv4Addresses(jsonData) {
  if (!jsonData.prefixes || !Array.isArray(jsonData.prefixes)) {
    logError(`Unexpected JSON structure: ${JSON.stringify(jsonData)}`);
    return [];
  }

  return jsonData.prefixes
    .filter(prefix => prefix.ipv4Prefix)
    .map(prefix => prefix.ipv4Prefix);
}

// Merged [start, end) address intervals for a list of IPv4 CIDRs
function toIntervals(cidrs) {
  const ranges = cidrs
    .map(cidr => {
      const [ip, bits = '32'] = cidr.split('/');
      const size = 2 ** (32 - Number(bits));
      const address = ip
        .split('.')
        .reduce((acc, o) => acc * 256 + Number(o), 0);
      const start = address - (address % size);
      return [start, start + size];
    })
    .sort((a, b) => a[0] - b[0]);

  const merged = [];
  for (const [start, end] of ranges) {
    const last = merged[merged.length - 1];
    if (last && start <= last[1]) {
      last[1] = Math.max(last[1], end);
    } else {
      merged.push([start, end]);
    }
  }
  return merged;
}

function countAddresses(intervals) {
  return intervals.reduce((total, [start, end]) => total + end - start, 0);
}

function countSharedAddresses(a, b) {
  let shared = 0;
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    shared += Math.max(
      0,
      Math.min(a[i][1], b[j][1]) - Math.max(a[i][0], b[j][0])
    );
    if (a[i][1] < b[j][1]) i++;
    else j++;
  }
  return shared;
}

/**
 * Validate that the change in allowed addresses is within acceptable limits.
 * Compares address coverage rather than list entries, so a source that merges
 * or splits prefixes without changing what they cover does not trip the gate.
 * Uses added + removed rather than net change, so swapping ranges still does.
 * Throws if the change exceeds MAX_CHANGE_PERCENT.
 */
function validateIPChange(currentIPs, newIPs) {
  // Allow initial population when the IP set is empty
  if (currentIPs.length === 0) {
    logInfo(`Initial population: adding ${newIPs.length} IPs`);
    return;
  }

  const current = toIntervals(currentIPs);
  const next = toIntervals(newIPs);
  const currentCount = countAddresses(current);
  const shared = countSharedAddresses(current, next);

  const addedCount = countAddresses(next) - shared;
  const removedCount = currentCount - shared;
  const changedCount = addedCount + removedCount;
  const changePercent = (changedCount / currentCount) * 100;

  logInfo(`Current ranges: ${currentIPs.length}, new ranges: ${newIPs.length}`);
  logInfo(
    `Changed addresses: ${changedCount} (added: ${addedCount}, removed: ${removedCount}) of ${currentCount} (${changePercent.toFixed(2)}%)`
  );

  if (changePercent > MAX_CHANGE_PERCENT) {
    throw new Error(
      `IP content change of ${changePercent.toFixed(2)}% exceeds maximum allowed (${MAX_CHANGE_PERCENT}%). ` +
        `Changed addresses: ${changedCount} (added: ${addedCount}, removed: ${removedCount}) of ${currentCount}. ` +
        `Ranges: ${currentIPs.length} current, ${newIPs.length} new. ` +
        `This may indicate an issue with the source data.`
    );
  }

  logSuccess('IP content change is within acceptable limits');
}

/**
 * Fetch and parse JSON from a URL
 */
async function fetchJson(url, options) {
  const response = await fetch(url, options);
  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(
      `Failed to fetch ${url}: ${response.status} ${response.statusText}${body ? ` - ${body.slice(0, 200)}` : ''}`
    );
  }
  return response.json();
}

/**
 * Generic WAF IP set updater. Encapsulates the common pattern for updating
 * any WAF IP set (Google bots, GitHub Actions, etc.)
 *
 * @param {Object} config - Configuration object
 * @param {string} config.ipSetName - Name of the WAF IP set (e.g., 'google-bots')
 * @param {string} config.processName - Display name for logs (e.g., 'Google bot IP update')
 * @param {Function} config.fetchIPs - Async function that returns sorted array of IPs/CIDRs
 * @returns {Function} Lambda handler function
 */
function createWAFIPUpdater({ ipSetName, processName, fetchIPs }) {
  const {
    WAFV2Client,
    GetIPSetCommand,
    UpdateIPSetCommand,
  } = require('@aws-sdk/client-wafv2');

  const wafClient = new WAFV2Client({ region: 'us-east-1' });

  return async () => {
    try {
      logInfo(`Starting ${processName}...`);

      const ipSetId = process.env.IP_SET_ID;
      if (!ipSetId) {
        throw new Error('IP_SET_ID environment variable is required');
      }

      // Get current IP set
      logInfo(`Fetching current IP set: ${ipSetId}`);
      const response = await wafClient.send(
        new GetIPSetCommand({
          Scope: 'CLOUDFRONT',
          Id: ipSetId,
          Name: ipSetName,
        })
      );

      if (!response.IPSet) {
        throw new Error(`IP set '${ipSetName}' not found`);
      }

      const { IPSet: ipSet, LockToken: lockToken } = response;
      const currentIPs = ipSet.Addresses || [];

      // Fetch latest IPs from source
      const newIPs = await fetchIPs();

      // Check if there are any changes
      const currentIPsSet = new Set(currentIPs);
      const newIPsSet = new Set(newIPs);
      const hasChanges =
        currentIPs.length !== newIPs.length ||
        newIPs.some(ip => !currentIPsSet.has(ip));

      if (!hasChanges) {
        logSuccess('No changes detected. IP set is already up to date.');
        return {
          statusCode: 200,
          body: JSON.stringify({
            message: 'No changes needed',
            ipCount: currentIPs.length,
          }),
        };
      }

      // Validate the change magnitude
      validateIPChange(currentIPs, newIPs);

      // Update the IP set
      logInfo(`Updating IP set ${ipSetId} with ${newIPs.length} addresses...`);
      await wafClient.send(
        new UpdateIPSetCommand({
          Scope: 'CLOUDFRONT',
          Id: ipSetId,
          Name: ipSetName,
          Addresses: newIPs,
          LockToken: lockToken,
        })
      );
      logSuccess('IP set updated successfully');

      // Calculate added and removed IPs for reporting
      const addedIPs = newIPs.filter(ip => !currentIPsSet.has(ip));
      const removedIPs = currentIPs.filter(ip => !newIPsSet.has(ip));

      const sample = arr =>
        arr.length <= 10
          ? JSON.stringify(arr)
          : `${JSON.stringify(arr.slice(0, 10))} and ${arr.length - 10} more`;
      logInfo(`Added ${addedIPs.length} IPs: ${sample(addedIPs)}`);
      logInfo(`Removed ${removedIPs.length} IPs: ${sample(removedIPs)}`);

      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'IP set updated successfully',
          previousCount: currentIPs.length,
          newCount: newIPs.length,
          added: addedIPs.length,
          removed: removedIPs.length,
        }),
      };
    } catch (error) {
      logError(`${error.message}`);
      throw error; // Re-throw to trigger Lambda failure alarm
    }
  };
}

module.exports = {
  extractIpv4Addresses,
  fetchJson,
  validateIPChange,
  logInfo,
  logSuccess,
  logError,
  createWAFIPUpdater,
};
