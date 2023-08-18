import * as prismic from '@prismicio/client';
import {
  GetServerSidePropsPrismicClient,
  GetByTypeParams,
  fetcher,
  clientSideFetcher,
} from '.';
import { ArticlePrismicDocument } from '../types/articles';
import { ContentType } from '@weco/common/services/prismic/content-types';
import { ArticleBasic } from '@weco/content/types/articles';
import {
  articleFormatsFetchLinks,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
} from '../types';
import { seriesFetchLinks } from '../types/series';
import { eventsFetchLinks } from '../types/events';

const contentTypes: ContentType[] = ['articles', 'webcomics'];

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...articleFormatsFetchLinks,
  ...contributorFetchLinks,
  ...seriesFetchLinks,
  ...eventsFetchLinks,
];

const articlesFetcher = fetcher<ArticlePrismicDocument>(
  contentTypes,
  fetchLinks
);

export const fetchArticle = articlesFetcher.getById;

export const graphQuery = `{
  webcomics {
    ...webcomicsFields
    format {
      ...formatFields
    }
    body {
      ...on editorialImageGallery {
        non-repeat {
          title
        }
        repeat {
          image
          caption
        }
      }
    }
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
    promo {
      ... on editorialImage {
        non-repeat {
          caption
          image
        }
      }
    }
  }
  articles {
    ...articlesFields
    body {
      ...on standfirst {
        non-repeat {
          text
        }
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
        ... on organisations {
          ...organisationsFields
        }
      }
    }
    series {
      series {
        ...seriesFields
        schedule {
          ...scheduleFields
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
        promo {
          ... on editorialImage {
            non-repeat {
              caption
              image
            }
          }
        }
      }
    }
    promo {
      ... on editorialImage {
        non-repeat {
          caption
          image
        }
      }
    }
    seasons {
      season {
        ... on seasons {
          title
          promo {
            ... on editorialImage {
              non-repeat {
                caption
                image
              }
            }
          }
        }
      }
    }
  }
}`.replace(/\n(\s+)/g, '\n');

export const fetchArticles = (
  client: GetServerSidePropsPrismicClient,
  params: GetByTypeParams = {}
): Promise<prismic.Query<ArticlePrismicDocument>> => {
  return articlesFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
    graphQuery,
  });
};

export const fetchArticlesClientSide =
  clientSideFetcher<ArticleBasic>('articles').getByTypeClientSide;
