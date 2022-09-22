import { GetServerSidePropsPrismicClient } from '.';
import { StoriesLandingPrismicDocument } from '../types/stories-landing';

const graphQuery = `{
  stories-landing {
    introText
    storiesTitle
    storiesDescription
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
    booksTitle
    booksDescription
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
