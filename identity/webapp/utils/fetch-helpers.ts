// Fetch-based HTTP client utilities to replace axios
//
// This provides similar functionality to axios but using Node.js native fetch API.
// For server-side requests, it uses the shared undici agent for proper keep-alive
// configuration to prevent connection reset errors.

import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';

/**
 * Custom error class to replace AxiosError
 * Provides similar structure for error handling
 */
export class FetchError extends Error {
  response?: {
    status: number;
    statusText: string;
    data: unknown;
  };
  request?: RequestInfo | URL;

  constructor(
    message: string,
    response?: Response,
    data?: unknown,
    request?: RequestInfo | URL
  ) {
    super(message);
    this.name = 'FetchError';
    this.request = request;
    if (response) {
      this.response = {
        status: response.status,
        statusText: response.statusText,
        data,
      };
    }
  }
}

function getOrigin(url: string): string {
  return new URL(url).origin.toLowerCase();
}

function isAbsoluteHttpUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function normalisePathname(pathOrUrl: string): string {
  return new URL(pathOrUrl, 'https://trusted.local').pathname;
}

function ensureTrailingSlash(path: string): string {
  return path.endsWith('/') ? path : `${path}/`;
}

/**
 * Parse response body with fallback handling
 * Tries JSON first, falls back to text for error responses
 */
async function parseResponseData(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');

  // Try to read as text first so we don't lose error details
  const text = await response.text();

  if (!text) return null;

  // If content-type suggests JSON, try to parse it
  if (contentType?.includes('application/json')) {
    try {
      return JSON.parse(text);
    } catch {
      // JSON parse failed, return the raw text
      return text;
    }
  }

  // For non-JSON responses, return as-is
  return text;
}

/**
 * Wrapper around fetch that throws FetchError for non-2xx responses
 * Similar to axios behavior of throwing on error status codes
 */
async function fetchWithErrorHandling(
  url: RequestInfo | URL,
  options?: RequestInit & { validateStatus?: (status: number) => boolean }
): Promise<Response> {
  const { validateStatus, ...fetchOptions } = options || {};

  const response = await fetchWithUndiciAgent(url, fetchOptions);

  // Custom validation function or default to 2xx check
  const isValid = validateStatus
    ? validateStatus(response.status)
    : response.ok;

  if (!isValid) {
    // Clone response before consuming body for error
    const data = await parseResponseData(response.clone());
    throw new FetchError(
      `Request failed with status ${response.status}`,
      response,
      data,
      url
    );
  }

  return response;
}

/**
 * HTTP client with configured defaults (similar to axios.create())
 */
export class FetchClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private timeout?: number;

  constructor(config: {
    baseURL?: string;
    headers?: HeadersInit;
    timeout?: number;
  }) {
    this.baseURL = config.baseURL || '';
    this.defaultHeaders = config.headers || {};
    this.timeout = config.timeout;
  }

  private buildUrl(url: string): string {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `${this.baseURL}${url}`;
  }

  private mergeHeaders(headers?: HeadersInit): Record<string, string> {
    // Normalize HeadersInit to plain object to handle all valid forms:
    // - Plain object: { 'Content-Type': 'application/json' }
    // - Headers instance: new Headers()
    // - Array of tuples: [['Content-Type', 'application/json']]
    const normalized = new Headers(this.defaultHeaders);
    if (headers) {
      const additional = new Headers(headers);
      additional.forEach((value, key) => {
        normalized.set(key, value);
      });
    }

    // Convert back to plain object for fetch
    const result: Record<string, string> = {};
    normalized.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  private async executeRequest(
    url: string,
    options?: RequestInit & { validateStatus?: (status: number) => boolean }
  ): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    const headers = this.mergeHeaders(options?.headers);
    const baseURL = this.baseURL;

    if (!baseURL) {
      throw new Error(
        'FetchClient requires a baseURL to execute trusted requests'
      );
    }

    if (isAbsoluteHttpUrl(baseURL)) {
      const trustedOrigin = getOrigin(baseURL);
      const requestOrigin = getOrigin(fullUrl);
      if (requestOrigin !== trustedOrigin) {
        throw new Error(
          `Blocked request to untrusted origin: ${requestOrigin}. Expected: ${trustedOrigin}`
        );
      }
    } else {
      if (isAbsoluteHttpUrl(fullUrl)) {
        throw new Error(
          `Blocked absolute URL request for relative-base client: ${fullUrl}`
        );
      }

      const normalisedBasePath = ensureTrailingSlash(
        normalisePathname(baseURL)
      );
      const normalisedRequestPath = normalisePathname(fullUrl);
      const isWithinBasePath =
        normalisedRequestPath === normalisedBasePath.slice(0, -1) ||
        normalisedRequestPath.startsWith(normalisedBasePath);

      if (!isWithinBasePath) {
        throw new Error(
          `Blocked request outside configured base path: ${normalisedRequestPath}`
        );
      }
    }

    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | undefined;
    let abortListener: (() => void) | undefined;

    // Combine caller's signal with timeout signal
    let signal = options?.signal;
    if (this.timeout) {
      timeoutId = setTimeout(() => {
        controller.abort(new Error(`Request timeout after ${this.timeout}ms`));
      }, this.timeout);

      // If caller provided a signal, combine it with our timeout controller
      if (options?.signal) {
        // Check if already aborted - abort immediately if so
        if (options.signal.aborted) {
          controller.abort();
        } else {
          // Listen to caller's signal and abort our controller
          abortListener = () => controller.abort();
          options.signal.addEventListener('abort', abortListener, {
            once: true,
          });
        }
        signal = controller.signal;
      } else {
        signal = controller.signal;
      }
    }

    try {
      const response = await fetchWithErrorHandling(fullUrl, {
        ...options,
        headers,
        signal,
      });

      if (timeoutId) clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (timeoutId) clearTimeout(timeoutId);
      throw error;
    } finally {
      // Clean up event listener if request completed before signal was aborted
      if (abortListener && options?.signal) {
        options.signal.removeEventListener('abort', abortListener);
      }
    }
  }

  private prepareRequestBody(
    method: string,
    data?: unknown
  ): { body?: string; extraHeaders?: Record<string, string> } {
    // Only add body for methods that support it (not GET/HEAD)
    const upperMethod = method.toUpperCase();
    if (data !== undefined && upperMethod !== 'GET' && upperMethod !== 'HEAD') {
      return {
        body: JSON.stringify(data),
        extraHeaders: { 'Content-Type': 'application/json' },
      };
    }
    return {};
  }

  async request(options: {
    url: string;
    method?: string;
    data?: unknown;
    headers?: HeadersInit;
    validateStatus?: (status: number) => boolean;
    signal?: AbortSignal;
  }): Promise<{ status: number; data: unknown; statusText: string }> {
    const {
      url,
      method = 'GET',
      data,
      headers,
      validateStatus,
      signal,
    } = options;

    const { body, extraHeaders } = this.prepareRequestBody(method, data);

    // Combine caller headers with Content-Type if needed
    const combinedHeaders = extraHeaders
      ? { ...headers, ...extraHeaders }
      : headers;

    const response = await this.executeRequest(url, {
      method,
      body,
      headers: combinedHeaders,
      validateStatus,
      signal,
    });

    const responseData = await parseResponseData(response);

    return {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    };
  }

  async put(
    url: string,
    data?: unknown,
    config?: { headers?: HeadersInit }
  ): Promise<{ status: number; data: unknown; statusText: string }> {
    const { body, extraHeaders } = this.prepareRequestBody('PUT', data);

    // Combine caller headers with Content-Type if needed
    const combinedHeaders = extraHeaders
      ? { ...config?.headers, ...extraHeaders }
      : config?.headers;

    const response = await this.executeRequest(url, {
      method: 'PUT',
      body,
      headers: combinedHeaders,
    });

    const responseData = await parseResponseData(response);
    return {
      status: response.status,
      statusText: response.statusText,
      data: responseData,
    };
  }

  get defaults() {
    // Normalize defaultHeaders to plain object for safe spreading by callers
    const normalized = new Headers(this.defaultHeaders);
    const result: Record<string, string> = {};
    normalized.forEach((value, key) => {
      result[key] = value;
    });

    return {
      headers: {
        common: result,
      },
    };
  }
}
