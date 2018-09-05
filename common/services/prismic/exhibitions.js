// @flow
import Prismic from 'prismic-javascript';
import type {PrismicFragment, PrismicDocument, PaginatedResults} from './types';
import type {UiExhibition, UiExhibit, ExhibitionFormat} from '../../model/exhibitions';
import {getDocument, getDocuments} from './api';
import {
  peopleFields,
  contributorsFields,
  placesFields,
  installationFields,
  exhibitionFields
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
import {parseInstallationDoc} from './installations';
import {london} from '../../utils/format-date';
import {getPeriodPredicates} from './utils';
import type {Period} from '../../model/periods';

const startField = 'my.exhibitions.start';
const endField = 'my.exhibitions.end';

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
  const promo = document.data.promo;

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
      }
    }
  } : null;

  const promos = drupalPromoImage ? [{
    contentUrl: drupalPromoImage.image.contentUrl,
    width: drupalPromoImage.image.width,
    height: drupalPromoImage.image.height
  }] : [promoThin, promoSquare].filter(Boolean).map(p => p.image).filter(Boolean);
  const promoList = document.data.promoList || [];

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

  return {
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
      thinImage: promoThin && promoThin.image,
      description: (promoThin && promoThin.caption) || '',
      start,
      end,
      statusOverride
    },
    galleryLevel: document.data.galleryLevel,
    textAndCaptionsDocument: textAndCaptionsDocument,
    featuredImageList: promos,
    relatedBooks: promoList.filter(x => x.type === 'book').map(parsePromoListItem),
    relatedEvents: promoList.filter(x => x.type === 'event').map(parsePromoListItem),
    relatedGalleries: promoList.filter(x => x.type === 'gallery').map(parsePromoListItem),
    relatedArticles: promoList.filter(x => x.type === 'article').map(parsePromoListItem)
  };
}

type Order = 'desc' | 'asc';
type GetExhibitionsProps = {|
  predicates: Prismic.Predicates[],
  order: Order,
  period?: Period
|}
export async function getExhibitions(
  req: Request,
  {
    predicates = [],
    order = 'asc',
    period
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
        exhibitionFields
      ),
      orderings
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
    } else {
      acc.current.push(result);
    }

    return acc;
  }, {
    current: [],
    permanent: [],
    comingUp: []
  });

  return groupedResults.current
    .concat(groupedResults.permanent)
    .concat(groupedResults.comingUp);
}

export async function getExhibition(req: Request, id: string): Promise<?UiExhibition> {
  const document = await getDocument(req, id, {
    fetchLinks: peopleFields.concat(
      contributorsFields,
      placesFields,
      installationFields
    )
  });

  if (document && document.type === 'exhibitions') {
    const exhibition = parseExhibitionDoc(document);
    return exhibition;
  }
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
