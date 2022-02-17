import {
  Exhibition,
  ExhibitionRelatedContent,
} from '../../../types/exhibitions';
import {
  ExhibitionPrismicDocument,
  ExhibitionRelatedContentPrismicDocument,
} from '../types/exhibitions';
import { Query } from '@prismicio/types';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { transformQuery } from './paginated-results';
import { london } from '@weco/common/utils/format-date';
import { transformMultiContent } from './multi-content';
import {
  asText,
  isDocumentLink,
  isEmptyHtmlString,
  parseBoolean,
  parseImagePromo,
  parsePlace,
  parsePromoToCaptionedImage,
  parseSingleLevelGroup,
  parseTimestamp,
  parseTitle,
} from '@weco/common/services/prismic/parsers';
import { link } from './vendored-helpers';
import { breakpoints } from '@weco/common/utils/breakpoints';
import {
  parseExhibitionFormat,
  parseExhibits,
  parseResourceTypeList,
} from '@weco/common/services/prismic/exhibitions';
import { parseSeason } from '@weco/common/services/prismic/seasons';
import { transformGenericFields } from '.';

export function transformExhibition(
  document: ExhibitionPrismicDocument
): Exhibition {
  const genericFields = transformGenericFields(document);
  const data = document.data;
  const promo = data.promo;
  const exhibits = data.exhibits
    ? data.exhibits.map(i => link(i.item) && i.item.id)
    : [];
  const events = data.events
    ? data.events.map(i => link(i.item) && i.item.id)
    : [];
  const articles = data.articles
    ? data.articles.map(i => link(i.item) && i.item.id)
    : [];
  const relatedIds = [...exhibits, ...events, ...articles].filter(Boolean);
  const promoThin =
    promo && parseImagePromo(promo, '32:15', breakpoints.medium);
  const promoSquare =
    promo && parseImagePromo(promo, 'square', breakpoints.small);

  const promos = [promoThin, promoSquare]
    .filter(Boolean)
    .map(p => p.image)
    .filter(Boolean);

  const id = document.id;
  const format = data.format && parseExhibitionFormat(data.format);
  const url = `/exhibitions/${id}`;
  const title = parseTitle(data.title);
  const start = parseTimestamp(data.start);
  const end = data.end && parseTimestamp(data.end);
  const statusOverride = asText(data.statusOverride);
  const bslInfo = isEmptyHtmlString(data.bslInfo) ? undefined : data.bslInfo;
  const audioDescriptionInfo = isEmptyHtmlString(data.audioDescriptionInfo)
    ? undefined
    : data.audioDescriptionInfo;
  const promoImage =
    promo && promo.length > 0
      ? parsePromoToCaptionedImage(data.promo)
      : undefined;

  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });

  const exhibition = {
    ...genericFields,
    type: 'exhibitions',
    shortTitle: data.shortTitle && asText(data.shortTitle),
    format: format,
    start: start,
    end: end,
    isPermanent: parseBoolean(data.isPermanent),
    statusOverride: statusOverride,
    bslInfo: bslInfo,
    audioDescriptionInfo: audioDescriptionInfo,
    place: isDocumentLink(data.place) ? parsePlace(data.place) : undefined,
    exhibits: data.exhibits ? parseExhibits(data.exhibits) : [],
    promo: promoImage && {
      id,
      format,
      url,
      title,
      shortTitle: data.shortTitle && asText(data.shortTitle),
      image: promoImage && promoImage.image,
      squareImage: promoSquare && promoSquare.image,
      start,
      end,
      statusOverride,
    },
    featuredImageList: promos,
    resources: Array.isArray(data.resources)
      ? parseResourceTypeList(data.resources, 'resource')
      : [],
    relatedIds,
    seasons,
    prismicDocument: document,
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

  return { ...exhibition, labels };
}

export function transformExhibitionsQuery(
  query: Query<ExhibitionPrismicDocument>
): PaginatedResults<Exhibition> {
  const paginatedResult = transformQuery(query, transformExhibition);

  return {
    ...paginatedResult,
    results: putPermanentAfterCurrentExhibitions(paginatedResult.results),
  };
}

function putPermanentAfterCurrentExhibitions(
  exhibitions: Exhibition[]
): Exhibition[] {
  // We order the list this way as, from a user's perspective, seeing the
  // temporary exhibitions is more urgent, so they're at the front of the list,
  // but there's no good way to express that ordering through Prismic's ordering
  const groupedResults = exhibitions.reduce(
    (acc, result) => {
      // Wishing there was `groupBy`.
      if (result.isPermanent) {
        acc.permanent.push(result);
      } else if (london(result.start).isAfter(london())) {
        acc.comingUp.push(result);
      } else if (result.end && london(result.end).isBefore(london())) {
        acc.past.push(result);
      } else {
        acc.current.push(result);
      }

      return acc;
    },
    {
      current: [] as Exhibition[],
      permanent: [] as Exhibition[],
      comingUp: [] as Exhibition[],
      past: [] as Exhibition[],
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
  query: Query<ExhibitionRelatedContentPrismicDocument>
): ExhibitionRelatedContent => {
  const parsedContent = transformQuery(
    query,
    transformMultiContent
  ).results.filter(doc => {
    return !(doc.type === 'events' && doc.isPast);
  });

  return {
    exhibitionOfs: parsedContent.filter(
      doc => doc.type === 'exhibitions' || doc.type === 'events'
    ),
    exhibitionAbouts: parsedContent.filter(
      doc => doc.type === 'books' || doc.type === 'articles'
    ),
  } as ExhibitionRelatedContent;
};
