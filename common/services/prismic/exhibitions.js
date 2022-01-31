// @flow
import Prismic from '@prismicio/client';
import { getDocuments, getTypeByIds } from './api';
import { parseMultiContent } from './multi-content';
import {
  exhibitionFields,
  exhibitionResourcesFields,
  eventAccessOptionsFields,
  teamsFields,
  eventFormatsFields,
  placesFields,
  interpretationTypesFields,
  audiencesFields,
  eventSeriesFields,
  organisationsFields,
  peopleFields,
  contributorsFields,
  eventPoliciesFields,
  articleSeriesFields,
  articleFormatsFields,
  articlesFields,
} from './fetch-links';
// $FlowFixMe (ts)
import { breakpoints } from '../../utils/breakpoints';
import {
  parseTitle,
  parseImagePromo,
  parseTimestamp,
  parsePlace,
  parsePromoToCaptionedImage,
  isDocumentLink,
  asText,
  asHtml,
  parseGenericFields,
  parseBoolean,
  parseSingleLevelGroup,
  isEmptyHtmlString,
} from './parsers';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
// $FlowFixMe
import { london } from '../../utils/format-date';
import { getPeriodPredicates } from './utils';
import type { Period } from '../../model/periods';
import type { Resource } from '../../model/resource';
import type {
  PrismicFragment,
  PaginatedResults,
  PrismicDocument,
} from './types';
import type {
  UiExhibition,
  UiExhibit,
  ExhibitionFormat,
} from '../../model/exhibitions';
import type { MultiContent } from '../../model/multi-content';

const startField = 'my.exhibitions.start';
const endField = 'my.exhibitions.end';

function parseResourceTypeList(
  fragment: PrismicFragment[],
  labelKey: string
): Resource[] {
  return fragment
    .map(label => label[labelKey])
    .filter(Boolean)
    .filter(label => label.isBroken === false)
    .map(label => parseResourceType(label.data));
}

function parseResourceType(fragment: PrismicFragment): Resource {
  return {
    id: fragment.id,
    title: asText(fragment.title),
    description: fragment.description,
    icon: fragment.icon,
  };
}

export function parseExhibitionFormat(frag: Object): ?ExhibitionFormat {
  return isDocumentLink(frag)
    ? {
        id: frag.id,
        title: (frag.data && asText(frag.data.title)) || '',
        description: frag.data && asHtml(frag.data.description),
      }
    : undefined;
}

function parseExhibits(document: PrismicFragment[]): UiExhibit[] {
  return document
    .map(exhibit => {
      if (exhibit.item.type === 'exhibitions' && !exhibit.item.isBroken) {
        return {
          exhibitType: 'exhibitions',
          item: parseExhibitionDoc(exhibit.item),
        };
      }
    })
    .filter(Boolean);
}

export function parseExhibitionDoc(document: PrismicDocument): UiExhibition {
  const genericFields = parseGenericFields(document);
  const data = document.data;
  const promo = data.promo;
  const exhibits = data.exhibits ? data.exhibits.map(i => i.item.id) : [];
  const events = data.events ? data.events.map(i => i.item.id) : [];
  const articles = data.articles ? data.articles.map(i => i.item.id) : [];
  const books = data.books ? data.books.map(i => i.item.id) : [];
  const pages = data.pages ? data.pages.map(i => i.item.id) : [];
  const relatedIds = [
    ...exhibits,
    ...events,
    ...articles,
    ...books,
    ...pages,
  ].filter(Boolean);
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
    galleryLevel: document.data.galleryLevel,
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

type Order = 'desc' | 'asc';
type GetExhibitionsProps = {|
  predicates?: Prismic.Predicates[],
  order?: Order,
  period?: Period,
  page?: number,
|};
export async function getExhibitions(
  req: ?Request,
  {
    predicates = [],
    order = 'desc',
    period,
    page = 1,
  }: GetExhibitionsProps = {},
  memoizedPrismic: ?Object
): Promise<PaginatedResults<UiExhibition>> {
  const orderings = `[my.exhibitions.isPermanent desc,${endField}${
    order === 'desc' ? ' desc' : ''
  }]`;
  const periodPredicates = period
    ? getPeriodPredicates(period, startField, endField)
    : [];
  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.any('document.type', ['exhibitions'])].concat(
      predicates,
      periodPredicates
    ),
    {
      fetchLinks: peopleFields.concat(
        organisationsFields,
        contributorsFields,
        placesFields,
        exhibitionFields,
        exhibitionResourcesFields
      ),
      orderings,
      page,
    },
    memoizedPrismic
  );

  const uiExhibitions: UiExhibition[] =
    paginatedResults.results.map(parseExhibitionDoc);
  const exhibitionsWithPermAfterCurrent =
    putPermanentAfterCurrentExhibitions(uiExhibitions);

  // { ...paginatedResults, results: uiExhibitions } should work, but Flow still
  // battles with spreading.
  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: exhibitionsWithPermAfterCurrent,
  };
}

function putPermanentAfterCurrentExhibitions(
  exhibitions: UiExhibition[]
): UiExhibition[] {
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
      current: [],
      permanent: [],
      comingUp: [],
      past: [],
    }
  );

  return [
    ...groupedResults.current,
    ...groupedResults.permanent,
    ...groupedResults.comingUp,
    ...groupedResults.past,
  ];
}

type ExhibitionRelatedContent = {|
  exhibitionOfs: MultiContent[],
  exhibitionAbouts: MultiContent[],
|};

export async function getExhibitionRelatedContent(
  req: ?Request,
  ids: string[]
): Promise<ExhibitionRelatedContent> {
  const fetchLinks = [
    eventAccessOptionsFields,
    teamsFields,
    eventFormatsFields,
    placesFields,
    interpretationTypesFields,
    audiencesFields,
    organisationsFields,
    peopleFields,
    contributorsFields,
    eventSeriesFields,
    eventPoliciesFields,
    contributorsFields,
    articleSeriesFields,
    articleFormatsFields,
    exhibitionFields,
    articlesFields,
  ];
  const types = ['exhibitions', 'events', 'articles', 'books'];
  const extraContent = await getTypeByIds(req, types, ids, { fetchLinks });
  const parsedContent = parseMultiContent(extraContent.results).filter(doc => {
    return !(doc.type === 'events' && doc.isPast);
  });

  return {
    exhibitionOfs: parsedContent.filter(
      doc => doc.type === 'exhibitions' || doc.type === 'events'
    ),
    exhibitionAbouts: parsedContent.filter(
      doc => doc.type === 'books' || doc.type === 'articles'
    ),
  };
}

export async function getExhibitExhibition(
  req: ?Request,
  exhibitId: string
): Promise<?UiExhibition> {
  const predicates = [
    Prismic.Predicates.at('my.exhibitions.exhibits.item', exhibitId),
  ];
  const apiResponse = await getDocuments(req, predicates, {
    fetchLinks: peopleFields.concat(
      exhibitionFields,
      contributorsFields,
      placesFields
    ),
  });

  if (apiResponse.results.length > 0) {
    return parseExhibitionDoc(apiResponse.results[0]);
  }
}
