import {
  Story,
  PrismicApiError,
  StoryResultsList,
  PrismicResponseStory,
} from '@weco/common/model/story';
import fetch, { Response } from 'node-fetch';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import * as prismic from '@prismicio/client';
import { GraphQLClient, gql } from 'graphql-request';

export type PrismicQueryProps = {
  query?: string | string[];
  pageSize?: number;
};

export const prismicApiError = (): PrismicApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});

export async function prismicGraphQLClient(query: string) {
  const endpoint = prismic.getRepositoryEndpoint('wellcomecollection');
  const client = prismic.createClient(endpoint, { fetch });
  const graphqlClient = new GraphQLClient(
    prismic.getGraphQLEndpoint('wellcomecollection'),
    {
      method: 'get',
      fetch: client.graphQLFetch,
    }
  );

  const res = await graphqlClient.request(query);
  const json = await res;
  console.log(typeof json, 'anything back');
  return json;
}

// TODO: move Prismic fetch function out to common and use it here and in server-data/prismic
// To authenticate a request to the Prismic API graphql endpoint you need a Prismic-ref value that refreshes every 30 seconds.
// The ref can be used in a 'stale' state for 5 minutes before it expires
// https://community.prismic.io/t/for-how-long-is-it-safe-to-cache-a-prismic-api-ref/5962
export const prismicRefFetch = (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  return fetch(url, { ...options });
};

// Prismic API graphql endpoint expects query requests via GET method
// This means we need to be able to pass a body in the request, something that is not possible with fetch
// As a workaround I have used axios to make the request
export const prismicFetch = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return axios({ ...options });
};

export async function getStories({
  query,
  pageSize,
}: PrismicQueryProps): Promise<StoryResultsList<Story> | PrismicApiError> {
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
    const json = await res;
    const { allArticless } = json;
    console.log(allArticless, 'all articles');
    const stories = await transformStories(allArticless);

    return {
      type: 'ResultList',
      results: stories,
      totalResults: stories.length,
    };
  } catch (error) {
    return prismicApiError();
  }
}

export async function transformStories(allArticless: PrismicResponseStory) {
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
