/* eslint-env node */
/* global fetch */

// We rate-limit the USA in WAF (`geo-rate-limit-USA`)
// but we want to make sure SEO is not affected by this.
// This Lambda function will run on a schedule to fetch the latest
// Google bot IP ranges and update the whitelisted IP set accordingly.

const {
  WAFv2Client,
  GetIPSetCommand,
  UpdateIPSetCommand,
} = require('@aws-sdk/client-wafv2');
const { styleText } = require('util');

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

const wafClient = new WAFv2Client({ region: 'us-east-1' });

const IP_SET_NAME = 'google-bots';
const IP_SET_SCOPE = 'CLOUDFRONT';
const MAX_CHANGE_PERCENT = 10;

// Google's IP range sources
const GOOGLE_IP_SOURCES = [
  'https://developers.google.com/static/crawling/ipranges/common-crawlers.json',
  'https://developers.google.com/static/crawling/ipranges/special-crawlers.json',
];

/**
 * Fetch and parse JSON from a URL
 */
async function fetchJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
  }
  return response.json();
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
 * Fetch all Google bot IPv4 addresses from both sources
 */
async function fetchGoogleBotIPs() {
  logInfo('Fetching Google bot IP ranges...');

  const results = await Promise.all(
    GOOGLE_IP_SOURCES.map(async url => {
      try {
        const data = await fetchJson(url);
        return extractIpv4Addresses(data);
      } catch (error) {
        logError(`Error fetching ${url}: ${error}`);
        throw error;
      }
    })
  );

  // Flatten and deduplicate
  const allIPs = [...new Set(results.flat())];
  logInfo(`Fetched ${allIPs.length} unique IPv4 addresses`);

  return allIPs.sort();
}

/**
 * Get current IP set from WAF
 */
async function getCurrentIPSet(ipSetId) {
  logInfo(`Fetching current IP set: ${ipSetId}`);

  const response = await wafClient.send(
    new GetIPSetCommand({
      Scope: IP_SET_SCOPE,
      Id: ipSetId,
      Name: IP_SET_NAME,
    })
  );

  if (!response.IPSet) {
    throw new Error(`IP set '${IP_SET_NAME}' not found`);
  }

  return {
    ipSet: response.IPSet,
    lockToken: response.LockToken,
  };
}

/**
 * Validate that the change in IP count is within acceptable limits
 */
function validateIPChange(currentIPs, newIPs) {
  const currentCount = currentIPs.length;
  const newCount = newIPs.length;

  // Allow initial population when the IP set is empty
  if (currentCount === 0) {
    logInfo(`Initial population: adding ${newCount} IPs`);
    return;
  }

  const currentIPsSet = new Set(currentIPs);
  const newIPsSet = new Set(newIPs);

  // Use the symmetric difference (added + removed) rather than net count change,
  // so swapping many prefixes without changing the total still triggers the gate.
  const addedCount = newIPs.filter(ip => !currentIPsSet.has(ip)).length;
  const removedCount = currentIPs.filter(ip => !newIPsSet.has(ip)).length;
  const changedCount = addedCount + removedCount;
  const changePercent = (changedCount / currentCount) * 100;

  logInfo(`Current IP count: ${currentCount}`);
  logInfo(`New IP count: ${newCount}`);
  logInfo(
    `Changed IPs: ${changedCount} (added: ${addedCount}, removed: ${removedCount}) (${changePercent.toFixed(2)}%)`
  );

  if (changePercent > MAX_CHANGE_PERCENT) {
    throw new Error(
      `IP content change of ${changePercent.toFixed(2)}% exceeds maximum allowed (${MAX_CHANGE_PERCENT}%). ` +
        `Changed: ${changedCount} (added: ${addedCount}, removed: ${removedCount}), Current: ${currentCount}, New: ${newCount}. ` +
        `This may indicate an issue with the source data.`
    );
  }

  logSuccess('IP content change is within acceptable limits');
}

/**
 * Update the WAF IP set with new addresses
 */
async function updateIPSet(ipSetId, lockToken, newAddresses) {
  logInfo(
    `Updating IP set ${ipSetId} with ${newAddresses.length} addresses...`
  );

  await wafClient.send(
    new UpdateIPSetCommand({
      Scope: IP_SET_SCOPE,
      Id: ipSetId,
      Name: IP_SET_NAME,
      Addresses: newAddresses,
      LockToken: lockToken,
    })
  );

  logSuccess('IP set updated successfully');
}

/**
 * Main Lambda handler
 */
exports.handler = async () => {
  try {
    logInfo('Starting Google bot IP update process...');

    const ipSetId = process.env.IP_SET_ID;
    if (!ipSetId) {
      throw new Error('IP_SET_ID environment variable is required');
    }

    // Get current IP set
    const { ipSet, lockToken } = await getCurrentIPSet(ipSetId);
    const currentIPs = ipSet.Addresses || [];

    // Fetch latest IPs from Google
    const newIPs = await fetchGoogleBotIPs();

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
    await updateIPSet(ipSet.Id, lockToken, newIPs);

    // Calculate added and removed IPs for reporting
    const addedIPs = newIPs.filter(ip => !currentIPsSet.has(ip));
    const removedIPs = currentIPs.filter(ip => !newIPsSet.has(ip));

    logInfo(`Added ${addedIPs.length} IPs: ${JSON.stringify(addedIPs)}`);
    logInfo(`Removed ${removedIPs.length} IPs: ${JSON.stringify(removedIPs)}`);

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
    logError(`Error updating Google bot IPs: ${error}`);
    throw error; // Re-throw to trigger Lambda failure alarm
  }
};
