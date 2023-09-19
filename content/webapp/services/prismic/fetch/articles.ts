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

const graphQuery = `{
  webcomics {
    title
    format {
      ... on article-formats {
        title
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
    series {
      series {
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
  articles {
    title
    format {
      ... on article-formats {
        title
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
    series {
      series {
        title
        promo {
          ... on editorialImage {
            non-repeat {
              caption
              image
            }
          }
        }
        body
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
