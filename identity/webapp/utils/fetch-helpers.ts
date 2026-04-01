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

/**
 * Parse response body as JSON with error handling
 */
async function parseResponseData(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Wrapper around fetch that throws FetchError for non-2xx responses
 * Similar to axios behavior of throwing on error status codes
 */
export async function fetchWithErrorHandling(
  url: RequestInfo | URL,
  options?: RequestInit & { validateStatus?: (status: number) => boolean }
): Promise<Response> {
  const { validateStatus, ...fetchOptions } = options || {};

  // Use undici agent on server, regular fetch on client
  const response = await fetchWithUndiciAgent(url, fetchOptions);

  // Custom validation function or default to 2xx check
  const isValid = validateStatus
    ? validateStatus(response.status)
    : response.ok;

  if (!isValid) {
    const data = await parseResponseData(response);
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

    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | undefined;

    // Combine caller's signal with timeout signal
    let signal = options?.signal;
    if (this.timeout) {
      timeoutId = setTimeout(() => controller.abort(), this.timeout);

      // If caller provided a signal, combine it with our timeout controller
      if (options?.signal) {
        // Check if already aborted - abort immediately if so
        if (options.signal.aborted) {
          controller.abort();
        } else {
          // Listen to caller's signal and abort our controller
          options.signal.addEventListener('abort', () => controller.abort(), {
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
    const mergedHeaders = this.mergeHeaders(headers);

    const response = await this.executeRequest(url, {
      method,
      body,
      headers: extraHeaders
        ? { ...mergedHeaders, ...extraHeaders }
        : mergedHeaders,
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
  ): Promise<{ status: number; data: unknown }> {
    const { body, extraHeaders } = this.prepareRequestBody('PUT', data);
    const mergedHeaders = this.mergeHeaders(config?.headers);

    const response = await this.executeRequest(url, {
      method: 'PUT',
      body,
      headers: extraHeaders
        ? { ...mergedHeaders, ...extraHeaders }
        : mergedHeaders,
    });

    const responseData = await parseResponseData(response);
    return { status: response.status, data: responseData };
  }

  get defaults() {
    return {
      headers: {
        common: this.defaultHeaders,
      },
    };
  }
}
