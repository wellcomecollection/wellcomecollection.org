import {
  Story,
  StoryResultsList,
  PrismicApiError,
} from '@weco/common/model/story';
import { prismicGraphQLClient } from '.';
import { transformStories } from '../transformers/articles';
import { gql } from 'graphql-request';

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
    const { allArticless } = await res;
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
