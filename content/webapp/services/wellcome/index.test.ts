import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';

import { wellcomeApiQuery } from '.';

jest.mock('@weco/common/utils/undici-agent', () => ({
  fetchWithUndiciAgent: jest.fn(),
}));

const mockFetch = fetchWithUndiciAgent as jest.MockedFunction<
  typeof fetchWithUndiciAgent
>;

// jsdom has no Response, so this stands in for the parts we read.
const respondWith = (status: number, body: unknown) =>
  mockFetch.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText: '',
    json: async () => body,
  } as Response);

const respondWithoutJson = (status: number, statusText: string) =>
  mockFetch.mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    statusText,
    json: async () => {
      throw new SyntaxError('Unexpected token <');
    },
  } as unknown as Response);

const apiError = (httpStatus: number) => ({
  type: 'Error',
  errorType: 'http',
  httpStatus,
  label: 'Error',
});

describe('wellcomeApiQuery', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns the results of a successful response', async () => {
    respondWith(200, { type: 'ResultList', results: [] });

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({ type: 'ResultList', results: [] });
  });

  it('passes through and logs an error in our error format', async () => {
    respondWith(500, apiError(500));

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 500 });
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it("turns a failed response that isn't in our error format into an error, and logs it", async () => {
    respondWith(500, { message: 'Internal Server Error' });

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 500 });
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  describe('a 429 from the API', () => {
    it.each([
      ['in our error format', () => respondWith(429, apiError(429))],
      [
        'in a different JSON format',
        () => respondWith(429, { message: 'Too Many Requests' }),
      ],
      ["that isn't JSON", () => respondWithoutJson(429, 'Too Many Requests')],
    ])('becomes a 503, %s, and is logged as a 429', async (_, respond) => {
      respond();

      const result = await wellcomeApiQuery('https://api.example/works');

      expect(result).toMatchObject({
        type: 'Error',
        httpStatus: 503,
        label: 'Service Unavailable',
      });
      expect(jest.mocked(console.warn).mock.calls[0][0]).toContain('HTTP 429');
    });
  });

  it.each([
    [404, 'in our error format', apiError(404)],
    [404, 'in a different JSON format', { message: 'Not Found' }],
    [414, 'in our error format', apiError(414)],
    [414, 'in a different JSON format', { message: 'URI Too Long' }],
  ])("returns but doesn't log a %i %s", async (status, _, body) => {
    respondWith(status, body);

    const result = await wellcomeApiQuery('https://api.example/works/abc');

    expect(result).toMatchObject({ type: 'Error', httpStatus: status });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('returns and logs an error when the request fails', async () => {
    mockFetch.mockRejectedValue(new TypeError('fetch failed'));

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 500 });
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("keeps the status of a failed response that isn't JSON, and logs it", async () => {
    respondWithoutJson(502, 'Bad Gateway');

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({
      type: 'Error',
      httpStatus: 502,
      label: 'Bad Gateway',
    });
    expect(console.warn).toHaveBeenCalledWith(
      expect.stringContaining('HTTP 502'),
      expect.any(SyntaxError)
    );
  });

  it("doesn't log a 404 that isn't JSON", async () => {
    respondWithoutJson(404, 'Not Found');

    const result = await wellcomeApiQuery('https://api.example/works/abc');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 404 });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("returns a 500, and logs it, for a successful response that isn't JSON", async () => {
    respondWithoutJson(200, 'OK');

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 500 });
    expect(console.error).toHaveBeenCalledWith(
      expect.stringContaining('HTTP 200'),
      expect.any(SyntaxError)
    );
  });

  it('passes fetch options through', async () => {
    respondWith(200, { type: 'ItemsList', results: [] });
    const options = { headers: { 'x-api-key': 'key' } };

    await wellcomeApiQuery('https://api.example/works/abc/items', options);

    expect(mockFetch).toHaveBeenCalledWith(
      'https://api.example/works/abc/items',
      options
    );
  });
});
