// @flow
import {getDocument} from './api';
import {parseBody, parseImagePromo, parseTitle} from './parsers';
import type {InfoPage} from '../../model/info-page';

export async function getInfoPage(req: Request, id: string): Promise<?InfoPage> {
  const infoPage = await getDocument(req, id, {});

  if (infoPage) {
    return {
      id: id,
      title: infoPage.data.title ? parseTitle(infoPage.data.title) : 'TITLE MISSING',
      body: infoPage.data.body ? parseBody(infoPage.data.body) : [],
      promo: infoPage.data.promo && parseImagePromo(infoPage.data.promo)
    };
  }
}
