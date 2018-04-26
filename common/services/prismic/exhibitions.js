// @flow
import Prismic from 'prismic-javascript';
import type {PrismicFragment, PrismicDocument, PaginatedResults} from './types';
import type {UiExhibition, UiExhibit} from '../../model/exhibitions';
import {getDocument, getDocuments} from './api';
import {
  peopleFields,
  contributorsFields,
  placesFields,
  installationFields
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
  asText,
  isDocumentLink
} from './parsers';
import {parseInstallationDoc} from './installations';

function parseExhibits(document: PrismicFragment[]): UiExhibit[] {
  return document.map(exhibit => {
    if (exhibit.item.type === 'installations') {
      return {
        exhibitType: 'installations',
        item: parseInstallationDoc(exhibit.item)
      };
    }
  }).filter(Boolean);
}

function parseExhibitionDoc(document: PrismicDocument): UiExhibition {
  const data = document.data;
  const promo = document.data.promo;

  const promoThin = promo && parseImagePromo(promo, '32:15', breakpoints.medium);
  const promoSquare = promo && parseImagePromo(promo, 'square', breakpoints.small);
  const promos = [promoThin, promoSquare].filter(Boolean).map(p => p.image).filter(Boolean);

  const promoList = document.data.promoList || [];

  const sizeInKb = Math.round(document.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = isDocumentLink(document.data.textAndCaptionsDocument) ? Object.assign({}, document.data.textAndCaptionsDocument, {sizeInKb}) : null;

  const id = document.id;
  const url = `/exhibitions/${id}`;
  const title = parseTitle(data.title);
  const description = parseDescription(data.description);
  const start = parseTimestamp(data.start);
  const end = data.end && parseTimestamp(data.end);
  const promoImage = parsePromoToCaptionedImage(data.promo);

  return {
    id: id,
    title: title,
    description: description,
    intro: asText(data.intro),
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    start: start,
    end: end,
    place: isDocumentLink(data.place) && parsePlace(data.place),
    exhibits: data.exhibits ? parseExhibits(data.exhibits) : [],

    /*
      This is the display logic.
      It would be nice to have these as separate steps,
      but flow has problems with spreading.
      https://github.com/facebook/flow/issues/3608
    */
    promo: {
      id,
      url,
      title,
      image: promoImage.image,
      description: asText(promoImage.caption) || 'PROMO TEXT MISSING',
      start,
      end
    }, // TODO
    galleryLevel: document.data.galleryLevel,
    textAndCaptionsDocument: textAndCaptionsDocument,
    featuredImageList: promos,
    relatedBooks: promoList.filter(x => x.type === 'book').map(parsePromoListItem),
    relatedEvents: promoList.filter(x => x.type === 'event').map(parsePromoListItem),
    relatedGalleries: promoList.filter(x => x.type === 'gallery').map(parsePromoListItem),
    relatedArticles: promoList.filter(x => x.type === 'article').map(parsePromoListItem)
  };
}

export async function getExhibitions(req: Request, id: string): Promise<PaginatedResults<UiExhibition>> {
  const paginateResults = await getDocuments(
    req,
    [Prismic.Predicates.at('document.type', 'exhibitions')],
    {
      fetchLinks: peopleFields.concat(
        contributorsFields,
        placesFields,
        installationFields
      ),
      orderings: '[my.exhibitions.start]'
    }
  );

  const uiExhibitions: UiExhibition[] = paginateResults.results.map(parseExhibitionDoc);
  // { ..paginatedResults, results: uiExhibitions } should work, but Flow still
  // battles with spreading.
  return {
    currentPage: paginateResults.currentPage,
    pageSize: paginateResults.pageSize,
    totalResults: paginateResults.totalResults,
    totalPages: paginateResults.totalPages,
    results: uiExhibitions
  };
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
