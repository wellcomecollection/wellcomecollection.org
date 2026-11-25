import { FetchClient, FetchError } from '@weco/identity/utils/fetch-helpers';

describe('FetchError', () => {
  it('should create error with response details', () => {
    const mockResponse = new Response('{"error": "test"}', {
      status: 400,
      statusText: 'Bad Request',
    });

    const error = new FetchError(
      'Request failed',
      mockResponse,
      { error: 'test' },
      'http://example.com'
    );

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('FetchError');
    expect(error.message).toBe('Request failed');
    expect(error.response?.status).toBe(400);
    expect(error.response?.statusText).toBe('Bad Request');
    expect(error.response?.data).toEqual({ error: 'test' });
    expect(error.request).toBe('http://example.com');
  });
});

describe('FetchClient', () => {
  it('should create instance with baseURL and headers', () => {
    const client = new FetchClient({
      baseURL: 'http://api.local',
      headers: { 'X-Custom': 'value' },
    });

    expect(client).toBeInstanceOf(FetchClient);
  });

  it('should normalize different header types', () => {
    // Test with Headers instance
    const client1 = new FetchClient({
      headers: new Headers({ 'X-Default': 'value' }),
    });
    expect(client1.defaults.headers.common['x-default']).toBe('value');

    // Test with tuple array
    const client2 = new FetchClient({
      headers: [['X-Custom', 'value']],
    });
    expect(client2.defaults.headers.common['x-custom']).toBe('value');

    // Test with plain object
    const client3 = new FetchClient({
      headers: { 'X-Plain': 'value' },
    });
    expect(client3.defaults.headers.common['x-plain']).toBe('value');
  });

  it('should support timeout configuration', () => {
    const client = new FetchClient({
      baseURL: 'http://api.local',
      timeout: 5000,
    });

    expect(client).toBeInstanceOf(FetchClient);
  });

  it('should handle already-aborted signal', async () => {
    const controller = new AbortController();
    controller.abort();

    const client = new FetchClient({ baseURL: 'http://api.local' });

    await expect(
      client.request({
        url: '/test',
        signal: controller.signal,
      })
    ).rejects.toThrow();
  });
});
