// @flow
import {getDocument} from './api';
import {parseGenericFields} from './parsers';
import type {PrismicDocument, HTMLString} from './types';
import type {GenericContentFields} from '../../model/generic-content-fields';

// TODO: 0_0
export type ArticleV2 = {|
  ...GenericContentFields,
  summary: ?HTMLString
|}

function parseArticle(document: PrismicDocument): ArticleV2 {
  return {
    ...parseGenericFields(document),
    summary: document.data.summary
  };
}

export async function getArticle(req: Request, id: string): Promise<?ArticleV2> {
  const document = await getDocument(req, id, {});
  return document && document.type === 'articles' ? parseArticle(document) : null;
}
