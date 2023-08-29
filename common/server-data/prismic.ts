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

async function fetchPrismicValues(): Promise<PrismicData> {
  const client = createPrismicClient();

  // If we don't get a result from Prismic for collectionVenues, we want to
  // bail out immediately, rather than writing bad server data.
  //
  // e.g. if Prismic times out sometimes we'll get `undefined` for the
  // collectionVenues, which throws a TypeError when we try to render it on a
  // page.  Better to wait for the next interval, and use the cached version
  // of the data, than 500.
  const collectionVenuesResult = await client
    .get({
      filters: [prismic.filter.any('document.type', ['collection-venue'])],
    })
    .catch(error => {
      throw new Error(
        `Failed to fetch 'collection venues' from Prismic: ${error}`
      );
    });

  const globalAlertResultPromise = client.getSingle('global-alert');
  const popupDialogResultPromise = client.getSingle('popup-dialog');

  const [globalAlertResult, popupDialogResult] = await Promise.all([
    globalAlertResultPromise,
    popupDialogResultPromise,
  ]);

  // If we don't get data from Prismic for either the popupDialog or the
  // globalAlert, we just send the defaultValue (which is hidden for both). See
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/10157
  // for the rationale behind treating these two and collectionVenues
  // differently.
  return {
    globalAlert: globalAlertResult.data
      ? globalAlertResult
      : defaultValue.globalAlert,
    popupDialog: popupDialogResult.data
      ? popupDialogResult
      : defaultValue.popupDialog,
    collectionVenues:
      collectionVenuesResult as prismic.Query<CollectionVenuePrismicDocument>,
  } as PrismicData;
}

export default handler;
