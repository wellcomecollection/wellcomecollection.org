/**
 * @jest-environment node
 */
import { NextApiRequest, NextApiResponse } from 'next';

import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';
import handler from '@weco/content/pages/api/works/items/[workId]';

jest.mock('@weco/common/server-data', () => ({
  getCachedToggles: jest.fn().mockResolvedValue({}),
}));

jest.mock('@weco/common/server-data/toggles', () => ({
  getTogglesFromContext: () => ({ featureFlags: { stagingApi: false } }),
}));

jest.mock('@weco/common/utils/undici-agent', () => ({
  fetchWithUndiciAgent: jest.fn(),
}));

const mockFetch = fetchWithUndiciAgent as jest.MockedFunction<
  typeof fetchWithUndiciAgent
>;

type RecordedResponse = NextApiResponse & {
  statusCode: number;
  body?: unknown;
};

const makeRequest = (workId: string) =>
  ({ query: { workId } }) as unknown as NextApiRequest;

const makeResponse = (): RecordedResponse => {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    setHeader: () => res,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: unknown) {
      res.body = payload;
      return res;
    },
  };
  return res as unknown as RecordedResponse;
};

const apiResponse = (status: number, body: unknown) =>
  ({
    ok: status >= 200 && status < 300,
    status,
    statusText: '',
    json: () => Promise.resolve(body),
  }) as unknown as Response;

const apiError = (httpStatus: number) =>
  apiResponse(httpStatus, {
    type: 'Error',
    errorType: 'http',
    httpStatus,
    label: 'Error',
    description: '',
  });

describe('/api/works/items/[workId]', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.items_api_key_prod = 'test-key';
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('sends a 404 for an invalid work ID, without calling the API', async () => {
    const res = makeResponse();
    await handler(makeRequest('BAD'), res);

    expect(res.statusCode).toBe(404);
    expect(res.body).toMatchObject({ type: 'Error', httpStatus: 404 });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('sends the items', async () => {
    const items = { type: 'ItemsList', totalResults: 0, results: [] };
    mockFetch.mockResolvedValue(apiResponse(200, items));

    const res = makeResponse();
    await handler(makeRequest('a2pjqhmz'), res);

    expect(res.statusCode).toBe(200);
    expect(res.body).toMatchObject(items);
    expect(mockFetch.mock.calls[0][1]).toMatchObject({
      headers: { 'x-api-key': 'test-key' },
    });
  });

  it('sends a 500, and logs it, when the request fails', async () => {
    mockFetch.mockRejectedValue(new TypeError('fetch failed'));

    const res = makeResponse();
    await handler(makeRequest('a2pjqhmz'), res);

    expect(res.statusCode).toBe(500);
    expect(console.error).toHaveBeenCalled();
  });

  it('passes on an API error, and logs it', async () => {
    mockFetch.mockResolvedValue(apiError(503));

    const res = makeResponse();
    await handler(makeRequest('a2pjqhmz'), res);

    expect(res.statusCode).toBe(503);
    expect(console.warn).toHaveBeenCalled();
  });

  it.each([404, 414])(
    'passes on a %i from the API without logging it',
    async status => {
      mockFetch.mockResolvedValue(apiError(status));

      const res = makeResponse();
      await handler(makeRequest('a2pjqhmz'), res);

      expect(res.statusCode).toBe(status);
      expect(console.warn).not.toHaveBeenCalled();
    }
  );
});
