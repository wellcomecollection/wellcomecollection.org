import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';
import mockToday from '@weco/common/test/utils/date-mocks';
import { asText } from '@weco/content/services/prismic/transformers';

import { GetServerSidePropsPrismicClient } from '.';
import { fetchExhibitions } from './exhibitions';

const client: GetServerSidePropsPrismicClient = {
  type: 'GetServerSidePropsPrismicClient',
  client: createPrismicClient(),
};

const timeout = 15 * 1000;

describe('fetchExhibitions', () => {
  // Implementation note: this test queries Prismic directly.
  //
  // In general we don't want to rely on external resources in our tests, because
  // they can introduce slow and flaky tests.  In this case it's a reasonable cost,
  // because getting the display of exhibitions right on closing date is:
  //
  //    1. Very important
  //    2. Something we've had issues with in the past
  //    3. Difficult to test without actually making the Prismic query
  //
  // We should be conservative about adding more tests here because of the drawbacks,
  // but having _a_ safety net for this test case is worthwhile imo.
  it(
    'fetches exhibitions up to and including their closing day, but not after',
    async () => {
      mockToday({ as: new Date('2023-04-23T12:00:00Z') });

      const closingDayResponse = await fetchExhibitions(client, {
        period: 'current-and-coming-up',
      });

      const closingDayExhibitions = closingDayResponse.results
        .map(e => ({
          id: e.id,
          title: asText(e.data.title),
        }))
        .sort((a, b) => (a.id > b.id ? 1 : -1))
        .slice(0, 6); // Slicing so we don't have to keep adding new exhibitions.

      // Of these exhibitions, three closed on 23 April 2023:
      // Objects in Stereo, The Archive of an Unseen, and the Healing Pavilion
      expect(closingDayExhibitions).toStrictEqual([
        { id: 'XNFfsxAAANwqbNWD', title: 'Being Human' },
        { id: 'Y0QhIxEAAA__0sMb', title: 'Objects in Stereo' },
        { id: 'Y3zI8hAAAGXXcMua', title: 'The Archive of an Unseen' },
        { id: 'Y8VNbhEAAPJM-oki', title: 'Milk' },
        { id: 'Yzv9ChEAABfUrkVp', title: 'The Healing Pavilion' },
        { id: 'ZAW0PxQAACcG-pX8', title: 'Genetic Automata' },
      ]);

      mockToday({ as: new Date('2023-04-24T12:00:00Z') });

      const nextDayResponse = await fetchExhibitions(client, {
        period: 'current-and-coming-up',
      });

      const nextDayExhibitions = nextDayResponse.results
        .map(e => ({
          id: e.id,
          title: asText(e.data.title),
        }))
        .sort((a, b) => (a.id > b.id ? 1 : -1))
        .slice(0, 3); // Slicing so we don't have to keep adding new exhibitions.

      expect(nextDayExhibitions).toStrictEqual([
        { id: 'XNFfsxAAANwqbNWD', title: 'Being Human' },
        { id: 'Y8VNbhEAAPJM-oki', title: 'Milk' },
        { id: 'ZAW0PxQAACcG-pX8', title: 'Genetic Automata' },
      ]);
    },
    timeout
  );
});
