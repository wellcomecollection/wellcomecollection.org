import * as prismic from '@prismicio/client';

import { fetcher, GetServerSidePropsPrismicClient } from '.';

function clientWith(
  methods: Partial<Record<'getByID' | 'getByUID', jest.Mock>>
): GetServerSidePropsPrismicClient {
  return {
    type: 'GetServerSidePropsPrismicClient',
    client: methods as unknown as GetServerSidePropsPrismicClient['client'],
  };
}

const notFound = () =>
  new prismic.NotFoundError('No documents were returned', '', undefined);

const pagesFetcher = fetcher<prismic.PrismicDocument>('pages', []);

describe('fetcher', () => {
  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('getById', () => {
    it('returns undefined when the document does not exist', async () => {
      const client = clientWith({
        getByID: jest.fn().mockRejectedValue(notFound()),
      });

      await expect(
        pagesFetcher.getById(client, 'abc')
      ).resolves.toBeUndefined();
    });

    it('returns undefined when the ID breaks the Prismic query', async () => {
      const client = clientWith({
        getByID: jest
          .fn()
          .mockRejectedValue(
            new prismic.ParsingError('api_parsing_error', '', undefined)
          ),
      });

      await expect(
        pagesFetcher.getById(client, 'foo"bar')
      ).resolves.toBeUndefined();
    });

    it('throws when Prismic fails for any other reason', async () => {
      const client = clientWith({
        getByID: jest.fn().mockRejectedValue(new TypeError('fetch failed')),
      });

      await expect(pagesFetcher.getById(client, 'abc')).rejects.toThrow(
        'fetch failed'
      );
    });
  });

  describe('getByUid', () => {
    it('returns undefined when the document does not exist', async () => {
      const client = clientWith({
        getByUID: jest.fn().mockRejectedValue(notFound()),
      });

      await expect(
        pagesFetcher.getByUid(client, 'cafe')
      ).resolves.toBeUndefined();
    });

    it('throws when Prismic fails for any other reason', async () => {
      const client = clientWith({
        getByUID: jest
          .fn()
          .mockRejectedValue(
            new prismic.PrismicError('Internal Server Error', '', undefined)
          ),
      });

      await expect(pagesFetcher.getByUid(client, 'cafe')).rejects.toThrow(
        'Internal Server Error'
      );
    });
  });
});
