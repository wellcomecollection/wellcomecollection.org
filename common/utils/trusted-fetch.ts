import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';

// Convert supported RequestInfo shapes into a URL so host checks are consistent.
function parseRequestUrl(url: RequestInfo | URL): URL {
  if (url instanceof URL) {
    return url;
  }

  if (typeof url === 'string') {
    return new URL(url);
  }

  if (typeof Request !== 'undefined' && url instanceof Request) {
    return new URL(url.url);
  }

  throw new Error('Unsupported URL type for trusted fetch');
}

// Allow callers to pass either hostnames or full URLs, and compare using hostname only.
function normaliseAllowedHosts(allowedHosts: string[]): Set<string> {
  const hosts = new Set<string>();

  for (const host of allowedHosts) {
    const trimmedHost = host.trim();
    if (!trimmedHost) continue;

    try {
      const asUrl =
        trimmedHost.startsWith('http://') || trimmedHost.startsWith('https://')
          ? new URL(trimmedHost)
          : new URL(`https://${trimmedHost}`);
      hosts.add(asUrl.hostname.toLowerCase());
    } catch {
      // Ignore malformed allowlist entries.
    }
  }

  return hosts;
}

// Wrapper around outbound fetch that enforces a host allowlist before any network call.
export async function fetchWithTrustedHosts(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
  allowedHosts: string[]
): Promise<Response> {
  const trustedHosts = normaliseAllowedHosts(allowedHosts);
  if (trustedHosts.size === 0) {
    throw new Error('No trusted hosts configured for trusted fetch');
  }

  const parsedUrl = parseRequestUrl(url);
  if (!trustedHosts.has(parsedUrl.hostname.toLowerCase())) {
    throw new Error(
      `Blocked outgoing request to untrusted host: ${parsedUrl.hostname}`
    );
  }

  return fetchWithUndiciAgent(parsedUrl, options);
}
