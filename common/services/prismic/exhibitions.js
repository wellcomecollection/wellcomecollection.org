// @flow
import Prismic from 'prismic-javascript';
import {getDocument, getDocuments, getTypeByIds} from './api';
import {parseMultiContent} from './multi-content';
import {
  exhibitionFields,
  exhibitionResourcesFields,
  installationFields,
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
  eventPoliciesFields
} from './fetch-links';
import {breakpoints} from '../../utils/breakpoints';
import {
  parseTitle,
  parseDescription,
  parseContributors,
  parseImagePromo,
  parseTimestamp,
  parsePlace,
  parsePromoListItem,
  parsePromoToCaptionedImage,
  isDocumentLink,
  asText,
  asHtml,
  parseGenericFields,
  parseBoolean
} from './parsers';
import { parseInstallationDoc } from './installations';
import {london} from '../../utils/format-date';
import {getPeriodPredicates} from './utils';
import type {Period} from '../../model/periods';
import type {Resource} from '../../model/resource';
import type {
  PrismicFragment,
  PrismicDocument,
  PaginatedResults
} from './types';
import type {UiExhibition, UiExhibit, ExhibitionFormat} from '../../model/exhibitions';
import type {MultiContent} from '../../model/multi-content';

const startField = 'my.exhibitions.start';
const endField = 'my.exhibitions.end';

function parseResourceTypeList(fragment: PrismicFragment[], labelKey: string): Resource[] {
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
    icon: fragment.icon
  };
}

export function parseExhibitionFormat(frag: Object): ?ExhibitionFormat {
  return isDocumentLink(frag) ? {
    id: frag.id,
    title: frag.data && asText(frag.data.title) || '',
    description: frag.data && asHtml(frag.data.description)
  } : null;
}

function parseExhibits(document: PrismicFragment[]): UiExhibit[] {
  return document.map(exhibit => {
    if (exhibit.item.type === 'installations' && !exhibit.item.isBroken) {
      return {
        exhibitType: 'installations',
        item: parseInstallationDoc(exhibit.item)
      };
    }
  }).filter(Boolean);
}

function parseExhibitionDoc(document: PrismicDocument): UiExhibition {
  const genericFields = parseGenericFields(document);
  const data = document.data;
  const promo = data.promo;
  const exhibits = data.exhibits ? data.exhibits.map(i => i.item.id) : [];
  const events = data.events ? data.events.map(i => i.item.id) : [];
  const articles = data.articles ? data.articles.map(i => i.item.id) : [];
  const books = data.books ? data.books.map(i => i.item.id) : [];
  const relatedIds = [...exhibits, ...events, ...articles, ...books].filter(Boolean);
  const promoThin = promo && parseImagePromo(promo, '32:15', breakpoints.medium);
  const promoSquare = promo && parseImagePromo(promo, 'square', breakpoints.small);

  // TODO: (drupal migration) Remove this
  const drupalPromoImage = document.data.drupalPromoImage && document.data.drupalPromoImage.url ? {
    caption: promoThin && promoThin.caption,
    image: {
      contentUrl: document.data.drupalPromoImage.url,
      width: document.data.drupalPromoImage.width || 1600,
      height: document.data.drupalPromoImage.height || 900,
      alt: '',
      tasl: {
        title: null,
        author: null,
        sourceName: null,
        sourceLink: null,
        license: null,
        copyrightHolder: null,
        copyrightLink: null
      },
      crops: {}
    }
  } : null;

  const promos = drupalPromoImage ? [{
    contentUrl: drupalPromoImage.image.contentUrl,
    width: drupalPromoImage.image.width,
    height: drupalPromoImage.image.height,
    alt: '',
    minWidth: null,
    tasl: { title: null,
      author: null,
      sourceName: null,
      sourceLink: null,
      license: null,
      copyrightHolder: null,
      copyrightLink: null }
  }] : [promoThin, promoSquare].filter(Boolean).map(p => p.image).filter(Boolean);

  const sizeInKb = Math.round(document.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = isDocumentLink(document.data.textAndCaptionsDocument) ? Object.assign({}, document.data.textAndCaptionsDocument, {sizeInKb}) : null;
  const id = document.id;
  const format = data.format && parseExhibitionFormat(data.format);
  const url = `/exhibitions/${id}`;
  const title = parseTitle(data.title);
  const description = parseDescription(data.description);
  const start = parseTimestamp(data.start);
  const end = data.end && parseTimestamp(data.end);
  const statusOverride = asText(data.statusOverride);

  const promoImage = drupalPromoImage || (promo && parsePromoToCaptionedImage(data.promo));
  // As we store the intro as an H2 in the model, incorrectly, we then convert
  // it here to a paragraph
  const intro = data.intro && data.intro[0] && [Object.assign({}, data.intro[0], {type: 'paragraph'})];
  const promoList = document.data.promoList || [];

  const exhibition = {
    ...genericFields,
    type: 'exhibitions',
    format: format,
    description: description,
    intro: intro,
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    start: start,
    end: end,
    isPermanent: parseBoolean(data.isPermanent),
    statusOverride: statusOverride,
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null,
    exhibits: data.exhibits ? parseExhibits(data.exhibits) : [],
    promo: {
      id,
      format,
      url,
      title,
      image: promoImage.image,
      squareImage: promoSquare && promoSquare.image,
      description: (promoThin && promoThin.caption) || '',
      start,
      end,
      statusOverride
    },
    galleryLevel: document.data.galleryLevel,
    textAndCaptionsDocument: textAndCaptionsDocument,
    featuredImageList: promos,
    resources: Array.isArray(data.resources) ? parseResourceTypeList(data.resources, 'resource') : [],
    relatedBooks: promoList.filter(x => x.type === 'book').map(parsePromoListItem),
    relatedEvents: promoList.filter(x => x.type === 'event').map(parsePromoListItem),
    relatedGalleries: promoList.filter(x => x.type === 'gallery').map(parsePromoListItem),
    relatedArticles: promoList.filter(x => x.type === 'article').map(parsePromoListItem),
    relatedIds
  };

  const labels = exhibition.isPermanent
    ? [{
      text: 'Permanent exhibition',
      url: null
    }]
    : [{ url: null, text: 'Exhibition' }];

  return {...exhibition, labels};
}

type Order = 'desc' | 'asc';
type GetExhibitionsProps = {|
  predicates: Prismic.Predicates[],
  order: Order,
  period?: Period,
  page?: number
|}
export async function getExhibitions(
  req: Request,
  {
    predicates = [],
    order = 'asc',
    period,
    page = 1
  }: GetExhibitionsProps = {}
): Promise<PaginatedResults<UiExhibition>> {
  const orderings = `[my.exhibitions.isPermanent desc,${endField}${order === 'desc' ? ' desc' : ''}]`;
  const periodPredicates = period ? getPeriodPredicates(
    period,
    startField,
    endField
  ) : [];
  const paginatedResults = await getDocuments(
    req,
    [Prismic.Predicates.any('document.type', ['exhibitions'])].concat(
      predicates,
      periodPredicates
    ),
    {
      fetchLinks: peopleFields.concat(
        contributorsFields,
        placesFields,
        installationFields,
        exhibitionFields,
        exhibitionResourcesFields
      ),
      orderings,
      page
    }
  );

  const uiExhibitions: UiExhibition[] = paginatedResults.results.map(parseExhibitionDoc);
  const exhibitionsWithPermAfterCurrent = putPermanentAfterCurrentExhibitions(uiExhibitions);

  // { ...paginatedResults, results: uiExhibitions } should work, but Flow still
  // battles with spreading.
  return {
    currentPage: paginatedResults.currentPage,
    pageSize: paginatedResults.pageSize,
    totalResults: paginatedResults.totalResults,
    totalPages: paginatedResults.totalPages,
    results: exhibitionsWithPermAfterCurrent
  };
}

function putPermanentAfterCurrentExhibitions(exhibitions: UiExhibition[]): UiExhibition[] {
  // We order the list this way as, from a user's perspective, seeing the
  // temporary exhibitions is more urgent, so they're at the front of the list,
  // but there's no good way to express that ordering through Prismic's ordering
  const groupedResults = exhibitions.reduce((acc, result) => {
    // Wishing there was `groupBy`.
    if (result.isPermanent) {
      acc.permanent.push(result);
    } else if (london(result.start).isAfter(london())) {
      acc.comingUp.push(result);
    } else if (london(result.end).isBefore(london())) {
      acc.past.push(result);
    } else {
      acc.current.push(result);
    }

    return acc;
  }, {
    current: [],
    permanent: [],
    comingUp: [],
    past: []
  });

  return [
    ...groupedResults.current,
    ...groupedResults.permanent,
    ...groupedResults.comingUp,
    ...groupedResults.past
  ];
}

export async function getExhibition(req: ?Request, id: string): Promise<?UiExhibition> {
  const document = await getDocument(req, id, {
    fetchLinks: peopleFields.concat(
      contributorsFields,
      placesFields,
      installationFields,
      exhibitionResourcesFields
    )
  });

  if (document && document.type === 'exhibitions') {
    const exhibition = parseExhibitionDoc(document);
    return exhibition;
  }
}

type ExhibitionRelatedContent = {|
  exhibitionOfs: MultiContent[],
  exhibitionAbouts: MultiContent[]
|}

// TODO better naming
export async function getExhibitionRelatedContent(req: ?Request, ids: string[]): Promise<ExhibitionRelatedContent> {
  const fetchLinks = [].concat(
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
    eventSeriesFields,
    eventPoliciesFields,
    contributorsFields
  );
  const types = ['events', 'installations', 'articles', 'books'];
  const extraContent = await getTypeByIds(req, types, ids, {fetchLinks});
  const parsedContent = parseMultiContent(extraContent.results).filter(doc => {
    return !(doc.type === 'events' && doc.isPast);
  });

  return {
    exhibitionOfs: parsedContent.filter(doc => doc.type === 'installations' || doc.type === 'events'),
    exhibitionAbouts: parsedContent.filter(doc => doc.type === 'books' || doc.type === 'articles')
  };
}

type ExhibitQuery = {| ids: string[] |}
export async function getExhibitionExhibits(
  req: Request,
  { ids }: ExhibitQuery
): Promise<?PaginatedResults<UiExhibit>> {
  const predicates = [Prismic.Predicates.in('document.id', ids)];
  const apiResponse = await getDocuments(req, predicates, {
    fetchLinks: peopleFields.concat(
      contributorsFields,
      placesFields,
      installationFields
    )
  });

  const exhibitResults = parseExhibits(apiResponse.results.map(result => {
    return {
      item: result
    };
  }));

  return {
    currentPage: apiResponse.currentPage,
    pageSize: apiResponse.pageSize,
    totalResults: apiResponse.totalResults,
    totalPages: apiResponse.totalPages,
    results: exhibitResults
  };
}

export async function getExhibitExhibition(req: Request, exhibitId: string): Promise<?UiExhibition> {
  const predicates = [Prismic.Predicates.at('my.exhibitions.exhibits.item', exhibitId)];
  const apiResponse = await getDocuments(req, predicates, {
    fetchLinks: peopleFields.concat(
      contributorsFields,
      placesFields,
      installationFields
    )
  });

  if (apiResponse.results.length > 0) {
    return parseExhibitionDoc(apiResponse.results[0]);
  }
}

export async function getExhibitionFromDrupalPath(req: Request, path: string): Promise<?UiExhibition> {
  const exhibitions = await getDocuments(req, [Prismic.Predicates.at('my.exhibitions.drupalPath', path)], {
    fetchLinks: peopleFields.concat(
      contributorsFields,
      placesFields,
      installationFields
    )
  });

  if (exhibitions.results.length > 0) {
    return parseExhibitionDoc(exhibitions.results[0]);
  }
}
