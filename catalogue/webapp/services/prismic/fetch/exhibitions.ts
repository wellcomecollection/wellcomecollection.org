import {
  Exhibition,
  PrismicResultsList,
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

export async function getExhibitions({
  query,
  pageSize,
}: PrismicQueryProps): Promise<
  PrismicResultsList<Exhibition> | PrismicApiError
> {
  const graphQuery = gql`query {
    allExhibitionss(fulltext: "${query}" sortBy: title_ASC first: ${pageSize}) {
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
            ...on ExhibitionsBodyStandfirst {
              primary {
                text
              }
            }
          }
          promo {
            ...on ExhibitionsPromoEditorialimage {
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
    const { allExhibitionss } = await res;
    const exhibitions = await transformStories(allExhibitionss);
    return {
      type: 'ResultList',
      results: exhibitions,
      totalResults: exhibitions.length,
    };
  } catch (error) {
    console.log(error);
    return prismicApiError();
  }
}
