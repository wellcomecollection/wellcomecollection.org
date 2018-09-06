// @flow
import {getDocument} from './api';
import {parseGenericFields} from './parsers';
import type {PrismicDocument, HTMLString} from './types';
import type {GenericContentFields} from '../../model/generic-content-fields';

const graphQuery = `{
  articles {
    ...articlesFields

    contributors {
      ...contributorsFields
      role {
        ...roleFields
      }
      contributor {
        ... on people {
          ...peopleFields
        }
        ... on organisations {
          ...organisationsFields
        }
      }
    }
  }
}`;

// TODO: 0_0
export type ArticleV2 = {|
  ...GenericContentFields,
  summary: ?HTMLString,
  datePublished: Date
|}

function parseArticle(document: PrismicDocument): ArticleV2 {
  return {
    ...parseGenericFields(document),
    summary: document.data.summary,
    datePublished: new Date(document.first_publication_date)
  };
}

export async function getArticle(req: Request, id: string): Promise<?ArticleV2> {
  const document = await getDocument(req, id, { graphQuery });
  return document && document.type === 'articles' ? parseArticle(document) : null;
}
