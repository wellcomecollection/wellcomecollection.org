import * as prismic from '@prismicio/client';

import { collectionVenueId } from '@weco/common/data/hardcoded-ids';
import {
  CollectionVenueDocument as RawCollectionVenueDocument,
  GlobalAlertDocument as RawGlobalAlertDocument,
  PopupDialogDocument as RawPopupDialogDocument,
} from '@weco/common/prismicio-types';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';
import { InferDataInterface } from '@weco/common/services/prismic/types';

import { Handler } from './';

export type RawCollectionVenueDocumentLite = {
  id: string;
} & {
  data: Omit<
    InferDataInterface<RawCollectionVenueDocument>,
    'link' | 'linkText' | 'image'
  >;
};

export type ResultsLite = {
  results: RawCollectionVenueDocumentLite[];
};

export type ReadingRoomStories = {
  stories: string[]; // Array of story UIDs, extracted from the 'reading-room-stories' page in Prismic
};

export const defaultValue: SimplifiedPrismicData = {
  globalAlert: {
    data: {
      isShown: 'hide' as const,
      routeRegex: null,
      text: [] as prismic.RichTextField,
    },
  },
  popupDialog: {
    data: {
      isShown: false,
      link: { link_type: 'Any' as const },
      linkText: null,
      openButtonText: null,
      text: [] as prismic.RichTextField,
      title: null,
      routeRegex: null,
    },
  },
  collectionVenues: {
    results: [],
  },
  readingRoomStories: {
    stories: [] as string[],
  },
};

export type PrismicData = {
  globalAlert: RawGlobalAlertDocument;
  popupDialog: RawPopupDialogDocument;
  collectionVenues: prismic.Query<RawCollectionVenueDocument>;
  readingRoomStories: ReadingRoomStories;
};

export type SimplifiedPrismicData = {
  globalAlert: { data: InferDataInterface<RawGlobalAlertDocument> };
  popupDialog: { data: InferDataInterface<RawPopupDialogDocument> };
  collectionVenues: ResultsLite;
  readingRoomStories: ReadingRoomStories;
};

export const handler: Handler<SimplifiedPrismicData, PrismicData> = {
  defaultValue,
  fetch: fetchPrismicValues,
};

async function fetchPrismicValues(): Promise<PrismicData> {
  const client = createPrismicClient();

  const collectionVenuesResultPromise = client.get({
    filters: [
      prismic.filter.in('document.id', [
        collectionVenueId.galleries.id,
        collectionVenueId.libraries.id,
        collectionVenueId.shop.id,
        collectionVenueId.café.id,
      ]),
    ],
  });
  const globalAlertResultPromise = client.getSingle('global-alert');
  const popupDialogResultPromise = client.getSingle('popup-dialog');
  const readingRoomStoriesPromise = client.getByUID(
    'pages',
    'reading-room-stories'
  );

  const [
    collectionVenuesResult,
    globalAlertResult,
    popupDialogResult,
    readingRoomStoriesResult,
  ] = await Promise.allSettled([
    collectionVenuesResultPromise,
    globalAlertResultPromise,
    popupDialogResultPromise,
    readingRoomStoriesPromise,
  ]);

  // If we don't get a result from Prismic for collectionVenues, we want to
  // bail out immediately, rather than writing bad server data.
  //
  // e.g. if Prismic times out sometimes we'll get `undefined` for the
  // collectionVenues, which throws a TypeError when we try to render it on a
  // page.  Better to wait for the next interval, and use the cached version
  // of the data, than 500.
  if (collectionVenuesResult.status !== 'fulfilled') {
    throw new Error(
      `Failed to fetch collection venues from Prismic: ${collectionVenuesResult.reason}`
    );
  }

  // If we don't get data from Prismic for either the popupDialog or the
  // globalAlert, we just send the defaultValue (which is hidden for both). See
  // https://github.com/wellcomecollection/wellcomecollection.org/issues/10157
  // for the rationale behind treating these two and collectionVenues
  // differently.

  // Extract story UIDs from reading room stories page
  let readingRoomStories: ReadingRoomStories = defaultValue.readingRoomStories;
  if (readingRoomStoriesResult.status === 'fulfilled') {
    const storyIds: string[] = [];
    for (const slice of readingRoomStoriesResult.value.data.body) {
      if (slice.slice_type === 'cardListing' && 'items' in slice) {
        for (const item of slice.items) {
          if ('content' in item && item.content && 'uid' in item.content) {
            const uid = item.content.uid;
            if (uid) {
              storyIds.push(uid);
            }
          }
        }
      }
    }
    readingRoomStories = { stories: storyIds };
  }

  return {
    globalAlert:
      globalAlertResult.status === 'fulfilled'
        ? globalAlertResult.value
        : defaultValue.globalAlert,
    popupDialog:
      popupDialogResult.status === 'fulfilled'
        ? popupDialogResult.value
        : defaultValue.popupDialog,
    collectionVenues: collectionVenuesResult.value,
    readingRoomStories,
  } as PrismicData;
}

export default handler;
