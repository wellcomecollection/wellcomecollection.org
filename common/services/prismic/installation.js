// @flow
import type {HTMLString, Body, PrismicDocument} from './types';
import type Contributor from '../../model/contributors';
import {getDocument} from './api';
import {
  parseTitle,
  parseDescription,
  parseBody,
  parseContributors
} from './parsers';

export type Installation = {|
  id: string,
  title: string,
  description: HTMLString,
  body: Body,
  contributors: Contributor[]
|};

function parseInstallationDoc(document: PrismicDocument) {
  const data = document.data;
  return {
    id: document.id,
    title: parseTitle(data.title),
    description: parseDescription(data.description),
    body: parseBody(data.body),
    contributors: parseContributors(data.contributors)
  };
}

export async function getInstallation(req: Request, id: string): Promise<?Installation> {
  const document = await getDocument(req, id, {});

  if (document && document.type === 'installations') {
    const installation = parseInstallationDoc(document);
    return installation;
  }
}
