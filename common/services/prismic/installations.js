// @flow
import type {PrismicDocument} from './types';
import type {UiInstallation} from '../../model/installations';
import {getDocument} from './api';
import {
  peopleFields,
  contributorsFields,
  placesFields,
  organisationsFields
} from './fetch-links';
import {
  parseTitle,
  parseDescription,
  parseContributors,
  parseImagePromo,
  parseTimestamp,
  parsePlace,
  parseBody,
  isDocumentLink
} from './parsers';

export function parseInstallationDoc(document: PrismicDocument): UiInstallation {
  const data = document.data;
  const promo = document.data.promo && parseImagePromo(document.data.promo);
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
    promo: promo,
    body: data.body ? parseBody(data.body) : []
  };
}

export async function getInstallation(req: Request, id: string): Promise<?UiInstallation> {
  const document = await getDocument(req, id, {
    fetchLinks: peopleFields.concat(contributorsFields, placesFields, organisationsFields)
  });

  if (document && document.type === 'installations') {
    const installation = parseInstallationDoc(document);
    return installation;
  }
}
