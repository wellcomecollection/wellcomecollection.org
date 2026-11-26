import * as prismic from '@prismicio/client';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

function clientWithGet(get: jest.Mock): GetServerSidePropsPrismicClient {
  return {
    type: 'GetServerSidePropsPrismicClient',
    client: { get } as unknown as GetServerSidePropsPrismicClient['client'],
  };
}

const document = { id: 'abc', uid: 'cafe', type: 'pages' };

const pagesFetcher = fetcher<prismic.PrismicDocument>('pages', []);

describe('fetcher', () => {
  describe.each([
    [
      'getById',
      (client: GetServerSidePropsPrismicClient) =>
        pagesFetcher.getById(client, 'abc'),
    ],
    [
      'getByUid',
      (client: GetServerSidePropsPrismicClient) =>
        pagesFetcher.getByUid(client, 'cafe'),
    ],
  ])('%s', (_, lookup) => {
    it('returns the document when there is one', async () => {
      const client = clientWithGet(
        jest.fn().mockResolvedValue({ results: [document] })
      );

      await expect(lookup(client)).resolves.toEqual(document);
    });

    it('returns undefined when nothing matches', async () => {
      const client = clientWithGet(
        jest.fn().mockResolvedValue({ results: [] })
      );

      await expect(lookup(client)).resolves.toBeUndefined();
    });

    it('returns undefined when the query is broken by junk in the URL', async () => {
      const client = clientWithGet(
        jest
          .fn()
          .mockRejectedValue(
            new prismic.ParsingError('api_parsing_error', '', undefined)
          )
      );

      await expect(lookup(client)).resolves.toBeUndefined();
    });

    it('throws when Prismic fails', async () => {
      const client = clientWithGet(
        jest.fn().mockRejectedValue(new TypeError('fetch failed'))
      );

      await expect(lookup(client)).rejects.toThrow('fetch failed');
    });
  });

  it('getById asks for one document of its type with that ID', async () => {
    const get = jest.fn().mockResolvedValue({ results: [] });

    await pagesFetcher.getById(clientWithGet(get), 'abc');

    expect(get).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 1,
        filters: [
          prismic.filter.at('document.type', 'pages'),
          prismic.filter.at('document.id', 'abc'),
        ],
      })
    );
  });

  it('getByUid asks for one document of its type with that UID', async () => {
    const get = jest.fn().mockResolvedValue({ results: [] });

    await pagesFetcher.getByUid(clientWithGet(get), 'cafe');

    expect(get).toHaveBeenCalledWith(
      expect.objectContaining({
        pageSize: 1,
        filters: [
          prismic.filter.at('document.type', 'pages'),
          prismic.filter.at('my.pages.uid', 'cafe'),
        ],
      })
    );
  });
});
