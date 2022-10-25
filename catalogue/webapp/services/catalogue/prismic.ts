import {
  prismicApiError,
  prismicFetch,
  // globalApiOptions,
  // looksLikeCanonicalId,
  notFound,
  // QueryProps,
  // prismicQuery,
  // rootUris,
} from './index';

import { Toggles } from '@weco/toggles';
import { Story, PrismicApiError } from '@weco/common/model/story';

type GetArticleProps = {
  query?: string;
  toggles: Toggles;
};

type PrismicResponse = Story | PrismicApiError;

// to return the article object from Prismic by id
export async function getArticle({
  query,
}: // toggles,
GetArticleProps): Promise<PrismicResponse> {
  // if (!looksLikeCanonicalId(id)) {
  //   return notFound();
  // }

  // const apiOptions = globalApiOptions(toggles);

  const headers = {
    Authorization:
      'Bearer MC5ZMWFsbWhFQUFBMUNKWTZP.77-9CO-_vSzvv71QHe-_ve-_ve-_vX3vv73vv71GPCFlWSrvv73vv709IHHvv73vv73vv70SFHDvv73vv70',
    // repository: 'wellcomecollection',
    'Prismic-Ref': 'Y1fYOBEAAEolKvzq',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const searchVariables = {
    searchString: query,
  };

  const graphQuery = `query {
  allArticless(fulltext: "${query}" sortBy: title_ASC) {
    edges {
      node {
        title
        _meta {
          lastPublicationDate
          id
        }
      }
    }
  }
}`;

  const url = `https://wellcomecollection.prismic.io/graphql?query=${graphQuery}`;

  const options = {
    method: 'GET',
    headers: headers,
    data: {
      query: { graphQuery },
      variables: searchVariables,
    },
    url: url,
  };
  const res = await prismicFetch(options);

  if (res.status === 404) {
    return notFound();
  }

  try {
    console.log('we are trying the get article function');
    return await res.data;
    // return await res.json();
  } catch (e) {
    console.log(e, 'what is the error in the get article function');
    return prismicApiError();
  }
}

// export async function getArticles(
//   props: QueryProps<PrismicApiProps>
// ): Promise<PrismicResultsList<Story> | PrismicApiError> {
//   return prismicQuery('articles', props);
// }
