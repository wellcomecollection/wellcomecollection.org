import * as prismic from '@prismicio/client';

import mockToday from '@weco/common/test/utils/date-mocks';

import { GetServerSidePropsPrismicClient } from '.';
import { fetchExhibitions } from './exhibitions';

const endField = 'my.exhibitions.end';

function createClientWithMockPrismicClient({
  getByType,
}: {
  getByType: jest.Mock;
}): GetServerSidePropsPrismicClient {
  return {
    type: 'GetServerSidePropsPrismicClient',
    client: {
      getByType,
    } as unknown as GetServerSidePropsPrismicClient['client'],
  };
}

describe('fetchExhibitions', () => {
  it('fetches exhibitions up to and including their closing day, but not after', async () => {
    // Real-world scenario: on the What's On page we want an exhibition to remain visible
    // throughout its *closing day* (e.g. it shouldn't disappear at 00:01 on that date),
    // but it must be removed from “current and coming up” the next day.
    //
    // This behaviour is implemented via Prismic date filters (which are strict “after”/
    // “before” comparisons), so we assert the generated filters directly rather than
    // querying Prismic over the network (which is slow/flaky and can hang in CI).
    const getByType = jest.fn(async () => ({
      page: 1,
      results_per_page: 20,
      results_size: 0,
      total_results_size: 0,
      total_pages: 0,
      next_page: null,
      prev_page: null,
      results: [],
      version: '',
      license: '',
    }));

    const client = createClientWithMockPrismicClient({ getByType });

    mockToday({ as: new Date('2023-04-23T12:00:00Z') });

    await fetchExhibitions(client, {
      period: 'current-and-coming-up',
    });

    expect(getByType).toHaveBeenCalledWith(
      'exhibitions',
      expect.objectContaining({
        filters: expect.arrayContaining([
          prismic.filter.dateAfter(endField, '2023-04-22'),
        ]),
        orderings: [
          { field: 'my.exhibitions.isPermanent', direction: 'desc' },
          { field: endField, direction: 'desc' },
        ],
      })
    );

    getByType.mockClear();

    mockToday({ as: new Date('2023-04-24T12:00:00Z') });

    await fetchExhibitions(client, {
      period: 'current-and-coming-up',
    });

    expect(getByType).toHaveBeenCalledWith(
      'exhibitions',
      expect.objectContaining({
        filters: expect.arrayContaining([
          prismic.filter.dateAfter(endField, '2023-04-23'),
        ]),
      })
    );
  });
});
