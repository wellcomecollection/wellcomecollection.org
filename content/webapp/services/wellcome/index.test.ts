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

  it("passes through an error in the API's own format", async () => {
    respondWith(500, {
      type: 'Error',
      errorType: 'http',
      httpStatus: 500,
      label: 'Internal Server Error',
    });

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 500 });
  });

  it("doesn't log a 404, which means the thing doesn't exist", async () => {
    respondWith(404, {
      type: 'Error',
      errorType: 'http',
      httpStatus: 404,
      label: 'Not Found',
    });

    const result = await wellcomeApiQuery('https://api.example/images/abc');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 404 });
    expect(console.warn).not.toHaveBeenCalled();
  });

  it('returns an error for a failed response in another format', async () => {
    respondWith(429, { message: 'Too Many Requests' });

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 429 });
  });

  it('returns an error when the request fails', async () => {
    mockFetch.mockRejectedValue(new TypeError('fetch failed'));

    const result = await wellcomeApiQuery('https://api.example/works');

    expect(result).toMatchObject({ type: 'Error', httpStatus: 500 });
  });
});
