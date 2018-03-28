// @flow
import type {PrismicDocument} from './types';
import type {UiInstallation} from '../../model/installations';
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
  isDocumentLink
} from './parsers';

export function parseInstallationDoc(document: PrismicDocument): UiInstallation {
  const data = document.data;
  const promo = document.data.promo;

  const promoThin = promo && parseImagePromo(promo, '32:15', breakpoints.medium);
  const promoSquare = promo && parseImagePromo(promo, 'square', breakpoints.small);
  const promos = [promoThin, promoSquare].filter(Boolean).map(p => p.image).filter(Boolean);

  return {
    id: document.id,
    title: parseTitle(data.title),
    description: parseDescription(data.description),
    contributors: data.contributors ? parseContributors(data.contributors) : [],
    start: parseTimestamp(data.start),
    end: data.end && parseTimestamp(data.end),
    place: isDocumentLink(data.place) && parsePlace(data.place),

    /*
      This is the display logic.
      It would be nice to have these as separate steps,
      but flow has problems with spreading.
      https://github.com/facebook/flow/issues/3608
    */
    featuredImageList: promos
  };
}

export async function getInstallation(req: Request, id: string): Promise<?UiInstallation> {
  const document = await getDocument(req, id, {
    fetchLinks: peopleFields.concat(contributorsFields, placesFields)
  });

  if (document && document.type === 'installations') {
    const installation = parseInstallationDoc(document);
    return installation;
  }
}
