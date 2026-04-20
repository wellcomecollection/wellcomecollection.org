/* eslint-env node */

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
    return;
  }

  const currentIPsSet = new Set(currentIPs);
  const newIPsSet = new Set(newIPs);

  const addedCount = newIPs.filter(ip => !currentIPsSet.has(ip)).length;
  const removedCount = currentIPs.filter(ip => !newIPsSet.has(ip)).length;
  const changedCount = addedCount + removedCount;
  const changePercent = (changedCount / currentIPs.length) * 100;

  if (changePercent > MAX_CHANGE_PERCENT) {
    throw new Error(
      `IP content change of ${changePercent.toFixed(2)}% exceeds maximum allowed (${MAX_CHANGE_PERCENT}%). ` +
        `Changed: ${changedCount} (added: ${addedCount}, removed: ${removedCount}), ` +
        `Current: ${currentIPs.length}, New: ${newIPs.length}. ` +
        `This may indicate an issue with the source data.`
    );
  }
}

module.exports = {
  extractIpv4Addresses,
  validateIPChange,
  logInfo,
  logSuccess,
  logError,
};
