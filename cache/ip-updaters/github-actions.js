// We rate-limit traffic in WAF but want to make sure GitHub Actions
// runners are not blocked. This Lambda fetches the latest GitHub Actions
// IP ranges and updates the whitelisted IP set accordingly.

const {
  WAFV2Client,
  GetIPSetCommand,
  UpdateIPSetCommand,
} = require('@aws-sdk/client-wafv2');

const {
  fetchJson,
  validateIPChange,
  logInfo,
  logSuccess,
  logError,
} = require('./helpers');

const wafClient = new WAFV2Client({ region: 'us-east-1' });

const IP_SET_NAME = 'github-actions';
const IP_SET_SCOPE = 'CLOUDFRONT';

const GITHUB_META_URL = 'https://api.github.com/meta';

/**
 * Fetch GitHub Actions IPv4 CIDR ranges from the /meta endpoint.
 * The response shape is { "actions": ["x.x.x.x/y", "::1/128", ...], ... }
 */
async function fetchGitHubActionsIPs() {
  logInfo('Fetching GitHub Actions IP ranges...');

  const data = await fetchJson(GITHUB_META_URL, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'wellcomecollection-ip-updater',
    },
  });

  if (!data.actions || !Array.isArray(data.actions)) {
    throw new Error(`Unexpected JSON structure from ${GITHUB_META_URL}`);
  }

  // Filter to IPv4 only (WAF IP set is IPV4) and deduplicate
  const ipv4Ranges = [
    ...new Set(data.actions.filter(cidr => !cidr.includes(':'))),
  ];

  logInfo(`Fetched ${ipv4Ranges.length} unique IPv4 ranges`);

  return ipv4Ranges.sort();
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
    logInfo('Starting GitHub Actions IP update process...');

    const ipSetId = process.env.IP_SET_ID;
    if (!ipSetId) {
      throw new Error('IP_SET_ID environment variable is required');
    }

    // Get current IP set
    const { ipSet, lockToken } = await getCurrentIPSet(ipSetId);
    const currentIPs = ipSet.Addresses || [];

    // Fetch latest IPs from GitHub
    const newIPs = await fetchGitHubActionsIPs();

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
    logError(`Error updating GitHub Actions IPs: ${error}`);
    throw error; // Re-throw to trigger Lambda failure alarm
  }
};
