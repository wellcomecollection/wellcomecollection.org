// Shared undici agent configuration for keep-alive connections
//
// Node.js native fetch (powered by undici) uses keep-alive connections by default,
// but with timeout values that don't match our server configuration.
// https://nodejs.org/api/globals.html#fetch
//
// This can lead to errors like:
//
//      FetchError: request to https://...
//      failed, reason: read ECONNRESET
//
// That's because the default keep-alive timeout doesn't align with the server:
//
// - default "idle-timeout" in akka-http is 60s https://doc.akka.io/docs/akka-http/current/configuration.html
// - NLBs have a fixed idle timeout of 350s https://docs.aws.amazon.com/elasticloadbalancing/latest/network/network-load-balancers.html#connection-idle-timeout
//
// As such, we use a custom undici agent configured to expire free sockets after 59s
// (1s less than the server timeout) to prevent connection resets.
// A good explanation of the problem, as well as the solution, is available here:
// https://connectreport.com/blog/tuning-http-keep-alive-in-node-js/

// Lazy-load undici.Agent (server-side only)
// We use dynamic import so undici isn't bundled into the client-side JavaScript
// Cache both the agent and the initialization promise to prevent concurrent initialization
let agentKeepAlive: import('undici').Dispatcher | null = null;
let agentPromise: Promise<import('undici').Dispatcher | null> | null = null;

export async function getUndiciAgent(): Promise<
  import('undici').Dispatcher | null
> {
  // Only load undici on the server side
  if (typeof window === 'undefined') {
    // If we're already initializing, return the existing promise
    if (agentPromise) {
      return agentPromise;
    }

    // If already initialized, return the cached agent
    if (agentKeepAlive) {
      return agentKeepAlive;
    }

    // Initialize once and cache the promise to prevent race conditions
    agentPromise = import('undici')
      .then(({ Agent }) => {
        agentKeepAlive = new Agent({
          keepAliveTimeout: 1000 * 59, // 1s less than the akka-http idle timeout
          keepAliveMaxTimeout: 1000 * 59,
        });
        return agentKeepAlive;
      })
      .catch(error => {
        // If initialization fails, reset the promise cache so subsequent calls can retry
        console.error('Failed to initialize undici agent:', error);
        agentPromise = null;
        return null;
      });

    return agentPromise;
  }

  return null;
}

/**
 * Fetch wrapper that uses the shared undici agent for proper keep-alive configuration.
 * Use this instead of the global fetch when you need to prevent connection reset errors.
 *
 * Server-side: Uses undici agent with custom keep-alive settings
 * Client-side: Falls back to regular fetch (undici not available in browser)
 *
 * @param url - The URL or Request object to fetch
 * @param options - Optional RequestInit options
 * @returns Promise<Response>
 */
export async function fetchWithUndiciAgent(
  url: RequestInfo | URL,
  options?: RequestInit
): Promise<Response> {
  // On the client side, just use regular fetch
  // On the server side, use undici agent for proper keep-alive configuration
  if (typeof window !== 'undefined') {
    return fetch(url, options);
  }

  // Node.js native fetch supports the dispatcher option for configuring the HTTP agent
  // The type assertion is needed because TypeScript's built-in RequestInit doesn't include dispatcher
  const agent = await getUndiciAgent();

  // If agent initialization failed for some reason, fall back to regular fetch
  if (!agent) {
    return fetch(url, options);
  }

  try {
    return await fetch(url, {
      ...options,
      dispatcher: agent,
    } as RequestInit);
  } catch (error) {
    // If the custom dispatcher is rejected by the current fetch runtime,
    // fall back to regular fetch rather than failing the entire request.
    console.warn('Falling back to default fetch without undici dispatcher', {
      error,
    });
    return fetch(url, options);
  }
}
