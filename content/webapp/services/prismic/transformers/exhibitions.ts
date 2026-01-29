import * as prismic from '@prismicio/client';

import {
  ExhibitionFormatsDocument as RawExhibitionFormatsDocument,
  ExhibitionsDocument as RawExhibitionsDocument,
} from '@weco/common/prismicio-types';
import {
  transformLink,
  transformTimestamp,
} from '@weco/common/services/prismic/transformers';
import {
  isFilledLinkToDocumentWithData,
  PaginatedResults,
} from '@weco/common/services/prismic/types';
import { ExhibitionRelatedContentPrismicDocument } from '@weco/content/services/prismic/types';
import {
  AccessPDF,
  Exhibit,
  Exhibition,
  ExhibitionBasic,
  ExhibitionFormat,
  ExhibitionRelatedContent,
} from '@weco/content/types/exhibitions';

import {
  asHtml,
  asRichText,
  asText,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import {
  transformContributors,
  transformContributorToContributorBasic,
} from './contributors';
import { transformVideoEmbed } from './embeds';
import { noAltTextBecausePromo } from './images';
import { transformMultiContent } from './multi-content';
import { transformQuery } from './paginated-results';
import { transformPlace } from './places';
import { transformSeasonsFromRelationshipGroup } from './seasons';

function transformExhibitionFormat(
  format: RawExhibitionFormatsDocument
): ExhibitionFormat {
  return {
    id: format.id,
    title: (format.data && asText(format.data.title)) || '',
    description: format.data && asHtml(format.data.description),
  };
}

export function transformExhibition(
  document: RawExhibitionsDocument
): Exhibition {
  const genericFields = transformGenericFields(document);
  const data = document.data;
  const exhibitIds = data.exhibits
    ? data.exhibits.map(i => prismic.isFilled.link(i.item) && i.item.id)
    : [];
  const eventIds = data.events
    ? data.events.map(i => prismic.isFilled.link(i.item) && i.item.id)
    : [];
  const articleIds = data.articles
    ? data.articles.map(i => prismic.isFilled.link(i.item) && i.item.id)
    : [];
  const relatedIds = [...exhibitIds, ...eventIds, ...articleIds].filter(
    Boolean
  );

  const accessResourcesPdfs: AccessPDF[] = data.accessResourcesPdfs
    ?.map(i => {
      const size = Math.round(parseInt(i.documentLink.size) / 1000) || 0;

      // Filter out empty access document blocks
      if (size > 0) {
        const text = asText(i.linkText) || '';
        const url = transformLink(i.documentLink) || '';

        return {
          text,
          url,
          size,
        };
      }
      return undefined;
    })
    .filter((doc): doc is AccessPDF => !!doc);

  const accessResourcesText = asRichText(data.accessResourcesText);
  const bslLeafletVideo =
    data.bslLeafletVideo && transformVideoEmbed(data.bslLeafletVideo);

  // TODO: Work out how to get this to type check without the 'as any'.
  const format = isFilledLinkToDocumentWithData(data.format)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformExhibitionFormat(data.format as any)
    : undefined;

  const start = transformTimestamp(data.start)!;
  const end = data.end ? transformTimestamp(data.end) : undefined;
  const statusOverride = asText(data.statusOverride);

  const seasons = transformSeasonsFromRelationshipGroup(
    transformSingleLevelGroup(data.seasons, 'season')
  );

  // Only transform exhibits that are full documents (have complete data).
  // When exhibits come from relationships/fetchLinks, they don't have all
  // the required fields for transformExhibition, causing performance issues
  // and errors as the transformer tries to access missing nested data.
  const exhibits: Exhibit[] = transformSingleLevelGroup(data.exhibits, 'item')
    .filter(exhibit => {
      // Check if this is a full document by looking for required fields
      // that wouldn't be present in a relationship
      const maybeDoc = exhibit as RawExhibitionsDocument;
      return maybeDoc.data && 'contributors' in maybeDoc.data;
    })
    .map(exhibit => {
      return {
        item: transformExhibition(exhibit as RawExhibitionsDocument),
      };
    });

  const place = isFilledLinkToDocumentWithData(data.place)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformPlace(data.place as any)
    : undefined;

  const contributors = transformContributors(document);

  const exhibition = {
    ...genericFields,
    uid: document.uid,
    shortTitle: data.shortTitle && asText(data.shortTitle),
    format,
    start,
    end,
    isPermanent: data.isPermanent === 'yes',
    statusOverride,
    place,
    exhibits,
    contributors,
    relatedIds,
    seasons,
    accessResourcesPdfs,
    accessResourcesText,
    bslLeafletVideo,
  };

  const labels = exhibition.isPermanent
    ? [
        {
          text: 'Permanent exhibition',
        },
      ]
    : exhibition.format
      ? [
          {
            text: exhibition.format.title,
          },
        ]
      : [{ text: 'Exhibition' }];

  return { ...exhibition, type: 'exhibitions', labels };
}

export function transformExhibitionToExhibitionBasic(
  exhibition: Exhibition
): ExhibitionBasic {
  // returns what is required to render ExhibitionCards and exhibition JSON-LD
  return (({
    type,
    id,
    uid,
    title,
    promo,
    format,
    start,
    end,
    isPermanent,
    statusOverride,
    contributors,
    labels,
  }) => ({
    type,
    id,
    uid,
    title,
    promo: promo && {
      ...promo,
      image: promo.image && {
        ...promo.image,
        ...noAltTextBecausePromo,
        tasl: undefined,
      },
    },
    format,
    start,
    end,
    isPermanent,
    statusOverride,
    contributors: contributors.map(transformContributorToContributorBasic),
    labels,
  }))(exhibition);
}

export function transformExhibitionsQuery(
  query: prismic.Query<RawExhibitionsDocument>
): PaginatedResults<ExhibitionBasic> {
  const paginatedResult = transformQuery(query, exhibition =>
    transformExhibitionToExhibitionBasic(transformExhibition(exhibition))
  );

  return {
    ...paginatedResult,
    results: putPermanentAfterCurrentExhibitions(paginatedResult.results),
  };
}

function putPermanentAfterCurrentExhibitions(
  exhibitions: ExhibitionBasic[]
): ExhibitionBasic[] {
  // We order the list this way as, from a user's perspective, seeing the
  // temporary exhibitions is more urgent, so they're at the front of the list,
  // but there's no good way to express that ordering through Prismic's ordering
  const now = new Date();

  const groupedResults = exhibitions.reduce(
    (acc, result) => {
      // Wishing there was `groupBy`.
      if (result.isPermanent) {
        acc.permanent.push(result);
      } else if (result.start.valueOf() >= now.valueOf()) {
        acc.comingUp.push(result);
      } else if (result.end && result.end.valueOf() < now.valueOf()) {
        acc.past.push(result);
      } else {
        acc.current.push(result);
      }

      return acc;
    },
    {
      current: [] as ExhibitionBasic[],
      permanent: [] as ExhibitionBasic[],
      comingUp: [] as ExhibitionBasic[],
      past: [] as ExhibitionBasic[],
    }
  );

  return [
    ...groupedResults.current,
    ...groupedResults.permanent,
    ...groupedResults.comingUp,
    ...groupedResults.past,
  ];
}

export const transformExhibitionRelatedContent = (
  query: prismic.Query<ExhibitionRelatedContentPrismicDocument>
): ExhibitionRelatedContent => {
  const parsedContent = transformQuery(
    query,
    transformMultiContent
  ).results.filter(doc => {
    // We don't include past events _unless_ they are still available to view online
    return !(doc.type === 'events' && doc.isPast && !doc.availableOnline);
  });

  return {
    exhibitionOfs: parsedContent.filter(
      doc =>
        doc.type === 'exhibitions' ||
        doc.type === 'events' ||
        doc.type === 'event-series'
    ),
    exhibitionAbouts: parsedContent.filter(
      doc =>
        doc.type === 'books' || doc.type === 'articles' || doc.type === 'series'
    ),
  } as ExhibitionRelatedContent;
};
