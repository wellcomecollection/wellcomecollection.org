// @flow
import {getDocument} from './api';

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

type Article = any;
export async function getArticle(req: Request, id: string): Promise<?Article> {
  const document = await getDocument(req, id, { graphQuery });
  return document && document.type === 'articles' ? document : null;
}
