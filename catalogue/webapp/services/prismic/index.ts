import {
  Story,
  PrismicApiError,
  StoryResultsList,
  PrismicResponseStory,
} from '@weco/common/model/story';
import fetch, { Response } from 'node-fetch';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { HttpsAgent as Agent } from 'agentkeepalive';

export type PrismicQueryProps = {
  query?: string | string[]
  pageSize?: number;
};

export const prismicApiError = (): PrismicApiError => ({
  errorType: 'http',
  httpStatus: 500,
  label: 'Internal Server Error',
  description: '',
  type: 'Error',
});

const agentKeepAlive = new Agent({
  keepAlive: true,
  freeSocketTimeout: 1000 * 59, // 1s less than the akka-http idle timeout
});

// TODO: add any tests for transforms
// To authenticate a request to the Prismic API graphql endpoint you need a Prismic-ref value that refreshes every 30 seconds.
// The ref can be used in a 'stale' state for 5 minutes before it expires
// https://community.prismic.io/t/for-how-long-is-it-safe-to-cache-a-prismic-api-ref/5962
export const prismicRefFetch = (
  url: string,
  options?: Record<string, string>
): Promise<Response> => {
  return fetch(url, { ...options, agent: agentKeepAlive });
};

// Prismic API graphql endpoint expects query requests via GET method
// This means we need to be able to pass a body in the request, something that is not possible with fetch
// As a workaround I have used axios to make the request
export const prismicFetch = (
  options?: AxiosRequestConfig
): Promise<AxiosResponse> => {
  return axios({ ...options });
};

export async function prismicQuery(
  endpoint: string,
  { query, pageSize }: PrismicQueryProps
): Promise<StoryResultsList<Story> | PrismicApiError> {
  const graphQuery = `query {
  allArticless(fulltext: "${query}" sortBy: title_ASC first: ${pageSize}) {
  edges {
      node {
        title
        _meta { id }
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
  const url = `https://wellcomecollection.prismic.io/graphql?query=${graphQuery}`;
  const fetchRefUrl = 'https://wellcomecollection.prismic.io/api/v2';

  const headers = {
    Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
    repository: 'wellcomecollection',
  };

  const prismicRef = await prismicRefFetch(fetchRefUrl, headers);
  const { refs } = await prismicRef.json();
  const { ref } = refs[0];
  headers['Prismic-ref'] = ref;
  const updatedHeaders = {
    Authorization: `Bearer ${process.env.PRISMIC_TOKEN}`,
    repository: 'wellcomecollection',
    'Prismic-ref': ref,
  };
  const options: AxiosRequestConfig = {
    method: 'GET',
    url: url,
    headers: updatedHeaders,
    data: {
      query: { graphQuery },
    },
  };

  try {
    const res = await prismicFetch(options);
    const json = await res.data;
    const { data } = json;
    const { allArticless } = data;
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

export async function getStories(
  props: PrismicQueryProps
): Promise<StoryResultsList<Story> | PrismicApiError> {
  return prismicQuery('stories', props);
}

export async function transformStories(allArticless: PrismicResponseStory) {
  const { edges } = allArticless;
  const stories = edges.map(edge => {
    const { node } = edge;
    const { title, contributors, body, promo, _meta } = node;
    const { primary: standfirst } = body[0];
    const { primary: image } = promo[0];
    const { id } = _meta;
    return {
      id,
      title,
      contributors,
      standfirst,
      image,
      type: 'Story',
    };
  });
  return stories;
}
