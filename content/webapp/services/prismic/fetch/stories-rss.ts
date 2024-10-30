import * as prismic from '@prismicio/client';

import { GetServerSidePropsPrismicClient } from '.';

const storyGraphQuery = `{
  articles {
    ...articlesFields
    format {
      ...formatFields
    }
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

  webcomics {
    ...webcomicsFields
    series {
      series {
        ...seriesFields
      }
    }
    contributors {
      ...contributorsFields
      role {
        ...roleFields
      }
      contributor {
        ... on people {
          ...peopleFields
        }
      }
    }
  }
}`;

export const fetchStoriesRss = async ({
  client,
}: GetServerSidePropsPrismicClient) =>
  await client.get({
    graphQuery: storyGraphQuery,
    orderings: [
      { field: 'my.articles.publishDate' },
      { field: 'my.webcomics.publishDate' },
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
    filters: [prismic.filter.any('document.type', ['articles', 'webcomics'])],
    pageSize: 100,
  });
