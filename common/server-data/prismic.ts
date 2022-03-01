import { Query } from '@prismicio/types';
import {
  CollectionVenuePrismicDocument,
  PopupDialogPrismicDocument,
  emptyPopupDialog,
  emptyPrismicQuery,
  GlobalAlertPrismicDocument,
  emptyGlobalAlert,
} from '../services/prismic/documents';
import { Handler } from './';
import * as prismic from 'prismic-client-beta';
import fetch from 'node-fetch';

export const defaultValue = {
  globalAlert: emptyGlobalAlert(),
  popupDialog: emptyPopupDialog(),
  collectionVenues: emptyPrismicQuery<CollectionVenuePrismicDocument>(),
} as const;

type Key = keyof typeof defaultValue;
export type PrismicData = {
  globalAlert: GlobalAlertPrismicDocument;
  popupDialog: PopupDialogPrismicDocument;
  collectionVenues: Query<CollectionVenuePrismicDocument>;
};

export const handler: Handler<PrismicData> = {
  defaultValue,
  fetch: fetchPrismicValues,
};

const fetchers: Record<Key, (client: prismic.Client) => unknown> = {
  globalAlert: async client => {
    const document = await client.getSingle('global-alert');
    return document;
  },

  popupDialog: async client => {
    const document = await client.getSingle('popup-dialog');
    return document;
  },

  collectionVenues: async client => {
    return client.get({
      predicates: [
        prismic.predicate.any('document.type', ['collection-venue']),
      ],
    });
  },
};

async function fetchPrismicValues(): Promise<PrismicData> {
  // We should probably make this generic somewhere.
  // The only place we have it is JS not TS, so leaving it ungenerified for now
  const endpoint = prismic.getEndpoint('wellcomecollection');
  const client = prismic.createClient(endpoint, { fetch });

  const keys = Object.keys(fetchers);
  const values = await Promise.allSettled(
    Object.values(fetchers).map(fetcher => fetcher(client))
  );

  const zipped = keys.reduce((acc, key, i) => {
    const result = values[i];
    // we use `null` over `undefined` so it will be in the JSON
    const value = result.status === 'fulfilled' ? result.value : null;

    if (result.status === 'rejected') {
      console.error(`Failed to fetch ${keys[i]} from Prismic`, result.reason);
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  return zipped as PrismicData;
}

export default handler;
