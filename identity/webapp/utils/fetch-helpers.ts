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

  private mergeHeaders(headers?: HeadersInit): HeadersInit {
    return {
      ...this.defaultHeaders,
      ...headers,
    };
  }

  private async executeRequest(
    url: string,
    options?: RequestInit & { validateStatus?: (status: number) => boolean }
  ): Promise<Response> {
    const fullUrl = this.buildUrl(url);
    const headers = this.mergeHeaders(options?.headers);

    const controller = new AbortController();
    const signal = options?.signal || controller.signal;

    let timeoutId: NodeJS.Timeout | undefined;
    if (this.timeout) {
      timeoutId = setTimeout(() => controller.abort(), this.timeout);
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

    const requestOptions: RequestInit & {
      validateStatus?: (status: number) => boolean;
    } = {
      method,
      headers: this.mergeHeaders(headers),
      validateStatus,
      signal,
    };

    if (data !== undefined) {
      requestOptions.body = JSON.stringify(data);
      requestOptions.headers = {
        ...requestOptions.headers,
        'Content-Type': 'application/json',
      };
    }

    const response = await this.executeRequest(url, requestOptions);
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
    const response = await this.executeRequest(url, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: data
        ? { 'Content-Type': 'application/json', ...config?.headers }
        : config?.headers,
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
