// @flow
import {getDocument} from './api';

type Article = any;
export async function getArticle(req: Request, id: string): Promise<?Article> {
  const document = await getDocument(req, id, {});
  return document && document.type === 'articles' ? document : null;
}
