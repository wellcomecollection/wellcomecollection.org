// @flow
import {getDocument} from './api';
import {parseBody, parseImagePromo, parseTitle} from './parsers';
import type {InfoPage} from '../../model/info-pages';
import type {PrismicDocument} from './types';
import {infoPagesFields} from './fetch-links';

export function parseInfoPage(document: PrismicDocument) {
  return {
    type: 'info-pages',
    id: document.id,
    title: document.data.title ? parseTitle(document.data.title) : 'TITLE MISSING',
    body: document.data.body ? parseBody(document.data.body) : [],
    promo: document.data.promo && parseImagePromo(document.data.promo)
  };
}

export async function getInfoPage(req: Request, id: string): Promise<?InfoPage> {
  const infoPage = await getDocument(req, id, {
    fetchLinks: infoPagesFields
  });

  if (infoPage) {
    return parseInfoPage(infoPage);
  }
}
