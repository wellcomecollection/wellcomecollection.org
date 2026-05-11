import { fetchWithUndiciAgent } from '@weco/common/utils/undici-agent';

import { fetchWithTrustedHosts } from './trusted-fetch';

jest.mock('@weco/common/utils/undici-agent', () => ({
  fetchWithUndiciAgent: jest.fn(),
}));

describe('fetchWithTrustedHosts', () => {
  const mockFetchWithUndiciAgent = fetchWithUndiciAgent as jest.MockedFunction<
    typeof fetchWithUndiciAgent
  >;

  beforeEach(() => {
    mockFetchWithUndiciAgent.mockReset();
  });

  it('forwards allowlisted requests to undici fetch', async () => {
    const mockResponse = { ok: true } as Response;
    mockFetchWithUndiciAgent.mockResolvedValue(mockResponse);

    const options = { method: 'GET' };
    const result = await fetchWithTrustedHosts(
      'https://api.wellcomecollection.org/works',
      options,
      ['api.wellcomecollection.org']
    );

    expect(result).toBe(mockResponse);
    expect(mockFetchWithUndiciAgent).toHaveBeenCalledTimes(1);

    const [calledUrl, calledOptions] = mockFetchWithUndiciAgent.mock.calls[0];
    expect(calledUrl).toBeInstanceOf(URL);
    expect((calledUrl as URL).hostname).toBe('api.wellcomecollection.org');
    expect(calledOptions).toEqual(options);
  });

  it('accepts allowlist entries provided as full URLs', async () => {
    const mockResponse = { ok: true } as Response;
    mockFetchWithUndiciAgent.mockResolvedValue(mockResponse);

    await fetchWithTrustedHosts(
      'https://api-stage.wellcomecollection.org/events',
      undefined,
      ['https://api-stage.wellcomecollection.org']
    );

    expect(mockFetchWithUndiciAgent).toHaveBeenCalledTimes(1);
  });

  it('throws when URL host is not allowlisted', async () => {
    await expect(
      fetchWithTrustedHosts('https://example.com/works', undefined, [
        'api.wellcomecollection.org',
      ])
    ).rejects.toThrow(
      'Blocked outgoing request to untrusted host: example.com'
    );

    expect(mockFetchWithUndiciAgent).not.toHaveBeenCalled();
  });

  it('throws when no valid trusted hosts are configured', async () => {
    await expect(
      fetchWithTrustedHosts(
        'https://api.wellcomecollection.org/works',
        undefined,
        ['', '   ', '://not-a-host']
      )
    ).rejects.toThrow('No trusted hosts configured for trusted fetch');

    expect(mockFetchWithUndiciAgent).not.toHaveBeenCalled();
  });
});
