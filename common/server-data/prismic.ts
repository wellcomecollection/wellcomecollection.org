import {
  CollectionVenuePrismicDocument,
  PopupDialogPrismicDocument,
  GlobalAlertPrismicDocument,
} from '../services/prismic/documents';
import { Handler } from './';
import * as prismic from '@prismicio/client';
import { InferDataInterface } from '../services/prismic/types';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';

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
      text: [] as prismic.RichTextField,
    },
  },
  popupDialog: {
    data: {
      isShown: false,
      link: { link_type: 'Web' },
      linkText: null,
      openButtonText: null,
      text: [] as prismic.RichTextField,
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
  collectionVenues: prismic.Query<CollectionVenuePrismicDocument>;
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
  globalAlert: async client => client.getSingle('global-alert'),

  popupDialog: async client => client.getSingle('popup-dialog'),

  collectionVenues: async client =>
    client.get({
      filters: [prismic.filter.any('document.type', ['collection-venue'])],
    }),
};

async function fetchPrismicValues(): Promise<PrismicData> {
  const client = createPrismicClient();

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
