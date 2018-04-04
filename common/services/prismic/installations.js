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
  parseBody
} from './parsers';

function parseInstallationDoc(document: PrismicDocument): UiInstallation {
  const data = document.data;
  const promo = document.data.promo;

  const promoThin = parseImagePromo(promo, '32:15', breakpoints.medium);
  const promoSquare = parseImagePromo(promo, 'square', breakpoints.small);
  const promos = [promoThin, promoSquare].filter(Boolean).map(p => p.image).filter(Boolean);

  return {
    id: document.id,
    title: parseTitle(data.title),
    description: parseDescription(data.description),
    contributors: parseContributors(data.contributors),
    start: parseTimestamp(data.start),
    end: data.end && parseTimestamp(data.end),
    place: data.place && parsePlace(data.place),

    /*
      This is the display logic.
      It would be nice to have these as separate steps,
      but flow has problems with spreading.
      https://github.com/facebook/flow/issues/3608
    */
    featuredImageList: promos,
    body: data.body ? parseBody(data.body) : []
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
