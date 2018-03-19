// @flow
import type {PrismicDocument} from './types';
import type {Installation} from '../../model/installations';
import {getDocument} from './api';
import {
  parseTitle,
  parseDescription,
  parseContributors
} from './parsers';

function parseInstallationDoc(document: PrismicDocument): Installation {
  const data = document.data;
  return {
    id: document.id,
    title: parseTitle(data.title),
    description: parseDescription(data.description),
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
