// @flow
/* eslint-disable */
import {getDocument} from './api';

type Article = any;
async function getArticle(req: Request, id: string): Promise<?Article> {
  const document = await getDocument(req, id, {});
  return document && document.type === 'article' ? document : null;
}
