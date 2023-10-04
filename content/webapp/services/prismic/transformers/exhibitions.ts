import {
  Exhibit,
  ExhibitionFormat,
  Exhibition,
  ExhibitionBasic,
  ExhibitionRelatedContent,
} from '../../../types/exhibitions';
import {
  ExhibitionPrismicDocument,
  ExhibitionRelatedContentPrismicDocument,
  ExhibitionFormat as ExhibitionFormatPrismicDocument,
} from '../types/exhibitions';
import {
  PaginatedResults,
  isFilledLinkToDocumentWithData,
} from '@weco/common/services/prismic/types';
import { transformQuery } from './paginated-results';
import { transformMultiContent } from './multi-content';
import {
  transformLink,
  transformTimestamp,
} from '@weco/common/services/prismic/transformers';
import {
  asHtml,
  asRichText,
  asText,
  transformGenericFields,
  transformSingleLevelGroup,
} from '.';
import { transformSeason } from './seasons';
import { transformPlace } from './places';
import { SeasonPrismicDocument } from '../types/seasons';
import {
  transformContributors,
  transformContributorToContributorBasic,
} from './contributors';
import * as prismic from '@prismicio/client';
import { noAltTextBecausePromo } from './images';

function transformExhibitionFormat(
  format: ExhibitionFormatPrismicDocument
): ExhibitionFormat {
  return {
    id: format.id,
    title: (format.data && asText(format.data.title)) || '',
    description: format.data && asHtml(format.data.description),
  };
}

export function transformExhibition(
  document: ExhibitionPrismicDocument
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
  const accessResourcesPdfs = data.accessResourcesPdfs?.map(i => {
    const text = asText(i.linkText) || '';
    const url = transformLink(i.documentLink) || '';
    const size = Math.round(parseInt(i.documentLink.size) / 1000) || 0;
    return {
      text,
      url,
      size,
    };
  });

  const accessResourcesText = asRichText(data.accessResourcesText);

  // TODO: Work out how to get this to type check without the 'as any'.
  const format = isFilledLinkToDocumentWithData(data.format)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformExhibitionFormat(data.format as any)
    : undefined;

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const start = transformTimestamp(data.start)!;
  const end = data.end ? transformTimestamp(data.end) : undefined;
  const statusOverride = asText(data.statusOverride);
  const bslInfo = asRichText(data.bslInfo);
  const audioDescriptionInfo = asRichText(data.audioDescriptionInfo);

  const seasons = transformSingleLevelGroup(data.seasons, 'season').map(
    season => transformSeason(season as SeasonPrismicDocument)
  );

  const exhibits: Exhibit[] = transformSingleLevelGroup(
    data.exhibits,
    'item'
  ).map(exhibit => {
    return {
      item: transformExhibition(exhibit as ExhibitionPrismicDocument),
    };
  });

  const place = isFilledLinkToDocumentWithData(data.place)
    ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
      transformPlace(data.place as any)
    : undefined;

  const contributors = transformContributors(document);

  const exhibition = {
    ...genericFields,
    shortTitle: data.shortTitle && asText(data.shortTitle),
    format,
    start,
    end,
    isPermanent: data.isPermanent === 'yes',
    statusOverride,
    bslInfo,
    audioDescriptionInfo,
    place,
    exhibits,
    contributors,
    relatedIds,
    seasons,
    accessResourcesPdfs,
    accessResourcesText,
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
  // returns what is required to render ExhibitionPromos and exhibition JSON-LD
  return (({
    type,
    id,
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
  query: prismic.Query<ExhibitionPrismicDocument>
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
