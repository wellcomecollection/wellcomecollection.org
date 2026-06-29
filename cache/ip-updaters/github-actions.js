// Automated updater for GitHub Actions runner IP ranges.
// Keeps the WAF IP allowlist in sync so GitHub Actions is not rate-limited.

const { fetchJson, createWAFIPUpdater, logInfo } = require('./waf-updater');

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
 * Create and export the Lambda handler
 */
exports.handler = createWAFIPUpdater({
  ipSetName: 'github-actions',
  processName: 'GitHub Actions IP update',
  fetchIPs: fetchGitHubActionsIPs,
});
