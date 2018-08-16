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
  parseDescription,
  parseTimestamp,
  parsePlace,
  isDocumentLink,
  parseGenericFields
} from './parsers';

export function parseInstallationDoc(document: PrismicDocument): UiInstallation {
  const data = document.data;
  const genericFields = parseGenericFields(document);

  return {
    ...genericFields,
    description: parseDescription(data.description),
    start: parseTimestamp(data.start),
    end: data.end && parseTimestamp(data.end),
    place: isDocumentLink(data.place) ? parsePlace(data.place) : null
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
