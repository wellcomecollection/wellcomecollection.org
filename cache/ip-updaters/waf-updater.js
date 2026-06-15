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

/**
 * Validate that the change in IP addresses is within acceptable limits.
 * Uses the symmetric difference (added + removed) rather than net count change,
 * so swapping many prefixes without changing the total still triggers the gate.
 * Throws if the change exceeds MAX_CHANGE_PERCENT.
 */
function validateIPChange(currentIPs, newIPs) {
  // Allow initial population when the IP set is empty
  if (currentIPs.length === 0) {
    logInfo(`Initial population: adding ${newIPs.length} IPs`);
    return;
  }

  const currentIPsSet = new Set(currentIPs);
  const newIPsSet = new Set(newIPs);

  const addedCount = newIPs.filter(ip => !currentIPsSet.has(ip)).length;
  const removedCount = currentIPs.filter(ip => !newIPsSet.has(ip)).length;
  const changedCount = addedCount + removedCount;
  const changePercent = (changedCount / currentIPs.length) * 100;

  logInfo(`Current IP count: ${currentIPs.length}`);
  logInfo(`New IP count: ${newIPs.length}`);
  logInfo(
    `Changed IPs: ${changedCount} (added: ${addedCount}, removed: ${removedCount}) (${changePercent.toFixed(2)}%)`
  );

  if (changePercent > MAX_CHANGE_PERCENT) {
    throw new Error(
      `IP content change of ${changePercent.toFixed(2)}% exceeds maximum allowed (${MAX_CHANGE_PERCENT}%). ` +
        `Changed: ${changedCount} (added: ${addedCount}, removed: ${removedCount}), ` +
        `Current: ${currentIPs.length}, New: ${newIPs.length}. ` +
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
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      };
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
