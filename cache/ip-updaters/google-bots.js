// Automated updater for Google bot IP ranges.
// Keeps the WAF IP allowlist in sync with Google's published common-crawlers list.

const {
  extractIpv4Addresses,
  fetchJson,
  createWAFIPUpdater,
  logInfo,
} = require('./waf-updater');

// Google's IP range source (common-crawlers only).
// Special-crawlers (AdsBot, APIs-Google, etc.) are intentionally excluded
const GOOGLE_IP_SOURCE =
  'https://developers.google.com/static/crawling/ipranges/common-crawlers.json';

/**
 * Fetch all Google bot IPv4 addresses
 */
async function fetchGoogleBotIPs() {
  logInfo('Fetching Google bot IP ranges...');
  const data = await fetchJson(GOOGLE_IP_SOURCE);
  // Deduplicate and sort
  const allIPs = [...new Set(extractIpv4Addresses(data))];
  logInfo(`Fetched ${allIPs.length} unique IPv4 addresses`);
  return allIPs.sort();
}

/**
 * Create and export the Lambda handler
 */
exports.handler = createWAFIPUpdater({
  ipSetName: 'google-bots',
  processName: 'Google bot IP update',
  fetchIPs: fetchGoogleBotIPs,
});
