// @flow
import type {PrismicDocument} from './types';
import type {UiExhibition} from '../../model/exhibitions';
import {getDocument} from './api';
import {peopleFields, contributorsFields, placesFields} from './fetch-links';
import {breakpoints} from '../../utils/breakpoints';
import {
  parseTitle,
  parseDescription,
  parseContributors,
  parseImagePromo,
  parseTimestamp,
  parsePlace,
  parsePromoListItem,
  asText
} from './parsers';

function parseExhibitionDoc(document: PrismicDocument): UiExhibition {
  const data = document.data;
  const promo = document.data.promo;

  const promoThin = promo && parseImagePromo(promo, '32:15', breakpoints.medium);
  const promoSquare = promo && parseImagePromo(promo, 'square', breakpoints.small);
  const promos = [promoThin, promoSquare].filter(Boolean).map(p => p.image).filter(Boolean);

  const promoList = document.data.promoList || [];

  const sizeInKb = Math.round(document.data.textAndCaptionsDocument.size / 1024);
  const textAndCaptionsDocument = Object.assign({}, document.data.textAndCaptionsDocument, {sizeInKb});

  return {
    id: document.id,
    title: parseTitle(data.title),
    description: parseDescription(data.description),
    intro: asText(data.intro),
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    start: parseTimestamp(data.start),
    end: data.end && parseTimestamp(data.end),
    place: data.place && parsePlace(data.place),
    exhibits: [],

    /*
      This is the display logic.
      It would be nice to have these as separate steps,
      but flow has problems with spreading.
      https://github.com/facebook/flow/issues/3608
    */
    promo: null, // TODO
    galleryLevel: document.data.galleryLevel,
    textAndCaptionsDocument: textAndCaptionsDocument,
    featuredImageList: promos,
    relatedBooks: promoList.filter(x => x.type === 'book').map(parsePromoListItem),
    relatedEvents: promoList.filter(x => x.type === 'event').map(parsePromoListItem),
    relatedGalleries: promoList.filter(x => x.type === 'gallery').map(parsePromoListItem),
    relatedArticles: promoList.filter(x => x.type === 'article').map(parsePromoListItem)
  };
}

export async function getExhibition(req: Request, id: string): Promise<?UiExhibition> {
  const document = await getDocument(req, id, {
    fetchLinks: peopleFields.concat(contributorsFields, placesFields)
  });

  if (document && document.type === 'exhibitions') {
    const exhibition = parseExhibitionDoc(document);
    return exhibition;
  }
}
