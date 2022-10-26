import {
  prismicApiError,
  prismicFetch,
  notFound,
  QueryProps,
  prismicQuery,
  prismicRefFetch,
} from '../catalogue';

import { Toggles } from '@weco/toggles';
import {
  Story,
  PrismicApiError,
  StoryResultsList,
} from '@weco/common/model/story';

type GetArticleProps = {
  query?: string;
  toggles: Toggles;
};

type PrismicResponse = Story | PrismicApiError;

// to return the article object from Prismic by id
export async function getArticle({
  query,
}: GetArticleProps): Promise<PrismicResponse> {
  const headers = {
    Authorization: `Bearer ${process.env.PRISMIC_TOKEN}`,
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  const prismicRef = await prismicRefFetch(
    'https://wellcomecollection.prismic.io/api/v2',
    headers
  );
  const { refs } = await prismicRef.json();
  const { ref } = refs[0];
  headers['Prismic-ref'] = ref;

  const searchVariables = {
    searchString: query,
  };

  const graphQuery = `{
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
    return await res.data;
    // return await res.json();
  } catch (e) {
    return prismicApiError();
  }
}

export type PrismicApiProps = {
  page?: number;
};

export async function getArticles(
  props: QueryProps<PrismicApiProps>
): Promise<StoryResultsList<Story> | PrismicApiError> {
  return prismicQuery('articles', props);
}
