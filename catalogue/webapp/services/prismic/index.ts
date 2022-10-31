import {
  Story,
  StoryResultsList,
  PrismicResponseStory,
  PrismicApiError,
  PrismicAllArticles,
} from '@weco/common/model/story';
import fetch from 'node-fetch';
import * as prismic from '@prismicio/client';
import { GraphQLClient, gql } from 'graphql-request';

export const prismicApiError = (): PrismicApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});

export type PrismicQueryProps = {
  query?: string | string[];
  pageSize?: number;
};

export async function prismicGraphQLClient(
  query: string
): Promise<PrismicResponseStory> {
  const endpoint = prismic.getRepositoryEndpoint('wellcomecollection');
  const client = prismic.createClient(endpoint, { fetch });
  const graphqlClient = new GraphQLClient(
    prismic.getGraphQLEndpoint('wellcomecollection'),
    {
      method: 'get',
      fetch: client.graphQLFetch,
    }
  );

  return graphqlClient.request(query);
}

export async function getStories({
  query,
  pageSize,
}: PrismicQueryProps): Promise<StoryResultsList<Story> | PrismicApiError> {
  console.log('we are in get stories');
  const graphQuery = gql`query {
  allArticless(fulltext: "${query}" sortBy: title_ASC first: ${pageSize}) {
  edges {
      node {
        title
        _meta { id, lastPublicationDate }
        contributors {
          contributor {
            ...on People {
              name
            }
          }
        }
        body {
          ...on ArticlesBodyStandfirst {
            primary {
              text
            }
          }
        }
        promo {
          ...on ArticlesPromoEditorialimage {
            primary {
              image
              link
              caption
            }
          }
        }
      }
    }
  }
}`;
  try {
    const res = await prismicGraphQLClient(graphQuery);
    const { allArticless }: PrismicAllArticles = await res;
    console.dir(allArticless, { depth: null });
    const stories = await transformStories(allArticless);

    return {
      type: 'ResultList',
      results: stories,
      totalResults: stories.length,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}

export async function transformStories(
  allArticless: PrismicResponseStory
): Promise<Story[]> {
  const { edges } = allArticless;
  const stories = edges.map(edge => {
    const { node } = edge;
    const { title, contributors, body, promo, _meta } = node;
    const { primary: standfirst } = body[0];
    const { primary: image } = promo[0];
    const { id, lastPublicationDate } = _meta;
    return {
      id,
      lastPublicationDate,
      title,
      contributors,
      standfirst,
      image,
      type: 'Story',
    };
  });
  return stories;
}
