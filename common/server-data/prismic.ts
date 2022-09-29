import { Query, RichTextField } from '@prismicio/types';
import {
  CollectionVenuePrismicDocument,
  PopupDialogPrismicDocument,
  GlobalAlertPrismicDocument,
} from '../services/prismic/documents';
import { Handler } from './';
import * as prismic from '@prismicio/client';
import fetch from 'node-fetch';
import { InferDataInterface } from '../services/prismic/types';

export type CollectionVenuePrismicDocumentLite = {
  id: string;
} & {
  data: Omit<
    InferDataInterface<CollectionVenuePrismicDocument>,
    'link' | 'linkText' | 'image'
  >;
};

export type ResultsLite = {
  results: CollectionVenuePrismicDocumentLite[];
};

export const defaultValue = {
  globalAlert: {
    data: {
      isShown: null,
      routeRegex: null,
      text: [] as RichTextField,
    },
  },
  popupDialog: {
    data: {
      isShown: false,
      link: { link_type: 'Web' },
      linkText: null,
      openButtonText: null,
      text: [] as RichTextField,
      title: null,
    },
  },
  collectionVenues: {
    results: [],
  },
};

type Key = keyof typeof defaultValue;
export type PrismicData = {
  globalAlert: GlobalAlertPrismicDocument;
  popupDialog: PopupDialogPrismicDocument;
  collectionVenues: Query<CollectionVenuePrismicDocument>;
};

export type SimplifiedPrismicData = {
  globalAlert: { data: InferDataInterface<GlobalAlertPrismicDocument> };
  popupDialog: { data: InferDataInterface<PopupDialogPrismicDocument> };
  collectionVenues: ResultsLite;
};

export const handler: Handler<SimplifiedPrismicData, PrismicData> = {
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

    // If we don't get a result from Prismic, we want to bail out immediately,
    // rather than writing bad server data.
    //
    // e.g. if Prismic times out sometimes we'll get `undefined` for the collectionVenues,
    // which throws a TypeError when we try to render it on a page.  Better to wait for
    // the next interval, and use the cached version of the data, than 500.
    //
    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7954
    if (result.status !== 'fulfilled') {
      throw new Error(
        `Failed to fetch ${keys[i]} from Prismic: ${result.reason}`
      );
    }

    return {
      ...acc,
      [key]: result.value,
    };
  }, {});

  return zipped as PrismicData;
}

export default handler;
