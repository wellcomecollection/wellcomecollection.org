// We rate-limit the USA in WAF (`geo-rate-limit-USA`)
// but we want to make sure SEO is not affected by this.
// This Lambda function will run on a schedule to fetch the latest
// Google bot IP ranges and update the whitelisted IP set accordingly.

const {
  WAFV2Client,
  GetIPSetCommand,
  UpdateIPSetCommand,
} = require('@aws-sdk/client-wafv2');

const {
  extractIpv4Addresses,
  fetchJson,
  validateIPChange,
  logInfo,
  logSuccess,
  logError,
} = require('./helpers');

const wafClient = new WAFV2Client({ region: 'us-east-1' });

const IP_SET_NAME = 'google-bots';
const IP_SET_SCOPE = 'CLOUDFRONT';

// Google's IP range source.
// Only common-crawlers is needed: the WAF rule requires both a Google IP and
// a "Googlebot" user-agent string, and special-crawlers (AdsBot, APIs-Google,
// etc.) never send a Googlebot UA so their IPs would never satisfy both conditions.
const GOOGLE_IP_SOURCE =
  'https://developers.google.com/static/crawling/ipranges/common-crawlers.json';

/**
 * Fetch all Google bot IPv4 addresses
 */
async function fetchGoogleBotIPs() {
  logInfo('Fetching Google bot IP ranges...');

  const data = await fetchJson(GOOGLE_IP_SOURCE);
  const allIPs = [...new Set(extractIpv4Addresses(data))];

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
    logError(`Error updating Google bot IPs: ${error}`);
    throw error; // Re-throw to trigger Lambda failure alarm
  }
};
