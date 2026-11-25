import * as prismic from '@prismicio/client';

import {
  CollectionVenueDocument as RawCollectionVenueDocument,
  GlobalAlertDocument as RawGlobalAlertDocument,
  PagesDocument as RawPagesDocument,
  PopupDialogDocument as RawPopupDialogDocument,
} from '@weco/common/prismicio-types';
import {
  PrismicData,
  ReadingRoomStories,
  ResultsLite,
  SimplifiedPrismicData,
  TendernessAndRageContent,
} from '@weco/common/server-data/prismic';
import { InferDataInterface } from '@weco/common/services/prismic/types';

// We don't want to add the raw prismic data to the ServerDataContext
// It gets included in the __NEXT_DATA__ script tag and adds unnecessary page weight
export function simplifyPrismicData(
  prismicData: PrismicData
): SimplifiedPrismicData {
  return {
    globalAlert: simplifyGlobalAlert(prismicData.globalAlert),
    popupDialog: simplifyPopupDialog(prismicData.popupDialog),
    collectionVenues: simplifyCollectionVenues(prismicData.collectionVenues),
    readingRoomStories: simplifyReadingRoomStories(
      prismicData.readingRoomStories
    ),
    tendernessAndRageContent: simplifyTendernessAndRageContent(
      prismicData.tendernessAndRageContent
    ),
  };
}

function simplifyGlobalAlert(doc: RawGlobalAlertDocument): {
  data: InferDataInterface<RawGlobalAlertDocument>;
} {
  return { data: doc.data };
}

function simplifyPopupDialog(doc: RawPopupDialogDocument): {
  data: InferDataInterface<RawPopupDialogDocument>;
} {
  return {
    data: doc.data,
  };
}

function simplifyCollectionVenues(
  doc: prismic.Query<RawCollectionVenueDocument>
): ResultsLite {
  return {
    results: doc.results.map(doc => {
      const id = doc.id;
      const {
        title,
        order,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        modifiedDayOpeningTimes,
      } = doc.data;
      return {
        id,
        data: {
          title,
          order,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
          modifiedDayOpeningTimes,
        },
      };
    }),
  };
}

function simplifyReadingRoomStories(
  doc: RawPagesDocument | null
): ReadingRoomStories {
  if (!doc) {
    return {};
  }

  const groupedStories: ReadingRoomStories = {};
  let cardListingIndex = 0;
  for (const slice of doc.data.body) {
    if (slice.slice_type === 'cardListing' && 'items' in slice) {
      const title =
        ('primary' in slice && slice.primary.title) ||
        `list-${cardListingIndex}`;
      cardListingIndex++;

      const storyIds: string[] = [];
      for (const item of slice.items) {
        if (
          'content' in item &&
          prismic.isFilled.contentRelationship(item.content) &&
          item.content.isBroken === false &&
          item.content.type === 'articles' &&
          item.content.uid
        ) {
          storyIds.push(item.content.uid);
        }
      }

      if (storyIds.length > 0) {
        groupedStories[title] = storyIds;
      }
    }
  }

  return groupedStories;
}

function simplifyTendernessAndRageContent(
  doc: RawPagesDocument | null
): TendernessAndRageContent {
  if (!doc) {
    return {};
  }

  const content: TendernessAndRageContent = {
    stories: [],
  };

  for (const slice of doc.data.body) {
    // Extract stories from cardListing slices (articles only)
    if (slice.slice_type === 'cardListing' && 'items' in slice) {
      for (const item of slice.items) {
        if (
          'content' in item &&
          prismic.isFilled.contentRelationship(item.content) &&
          item.content.isBroken === false &&
          item.content.type === 'articles' &&
          item.content.uid
        ) {
          content.stories?.push(item.content.uid);
        }
      }
    }
  }

  return content;
}
