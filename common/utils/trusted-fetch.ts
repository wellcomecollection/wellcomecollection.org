import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';

function isHttpProtocol(protocol: string): boolean {
  return protocol === 'http:' || protocol === 'https:';
}

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

// Allow callers to pass either origins or hostnames; compare using normalised origins.
function normaliseAllowedOrigins(allowedHosts: string[]): Set<string> {
  const origins = new Set<string>();

  for (const host of allowedHosts) {
    const trimmedHost = host.trim();
    if (!trimmedHost) continue;

    try {
      const asUrl =
        trimmedHost.startsWith('http://') || trimmedHost.startsWith('https://')
          ? new URL(trimmedHost)
          : new URL(`https://${trimmedHost}`);
      if (!isHttpProtocol(asUrl.protocol)) {
        continue;
      }

      origins.add(asUrl.origin.toLowerCase());
    } catch {
      // Ignore malformed allowlist entries.
    }
  }

  return origins;
}

// Wrapper around outbound fetch that enforces a host allowlist before any network call.
export async function fetchWithTrustedHosts(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
  allowedHosts: string[]
): Promise<Response> {
  const trustedOrigins = normaliseAllowedOrigins(allowedHosts);
  if (trustedOrigins.size === 0) {
    throw new Error('No trusted hosts configured for trusted fetch');
  }

  const parsedUrl = parseRequestUrl(url);
  if (!isHttpProtocol(parsedUrl.protocol)) {
    throw new Error(
      `Blocked outgoing request with unsupported scheme: ${parsedUrl.protocol}`
    );
  }

  if (!trustedOrigins.has(parsedUrl.origin.toLowerCase())) {
    throw new Error(
      `Blocked outgoing request to untrusted origin: ${parsedUrl.origin}`
    );
  }

  return fetchWithUndiciAgent(parsedUrl, options);
}
