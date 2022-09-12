import { GetServerSidePropsPrismicClient } from '.';
import { StoriesLandingPrismicDocument } from '../types/stories-landing';

const graphQuery = `{
  stories-landing {
    title
    description
    stories {
      story {
        ...on articles {
          ...articlesFields
        }
        ...on series {
          ...seriesFields
        }
      }
    }
    books {
      book {
        ...bookFields
      }
    }
  }
}`;

export const fetchStoriesLanding = ({
  client,
}: GetServerSidePropsPrismicClient): Promise<StoriesLandingPrismicDocument> => {
  return client.getSingle<StoriesLandingPrismicDocument>('stories-landing', {
    graphQuery,
  });
};
