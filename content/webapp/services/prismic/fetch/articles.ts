import * as prismic from '@prismicio/client';

import {
  ArticlesDocument as RawArticlesDocument,
  WebcomicsDocument as RawWebcomicsDocument,
} from '@weco/common/prismicio-types';
import { ContentType } from '@weco/common/services/prismic/content-types';
import {
  articleFormatsFetchLinks,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  eventsFetchLinks,
  seriesFetchLinks,
} from '@weco/content/services/prismic/types';
import { ArticleBasic } from '@weco/content/types/articles';

import {
  clientSideFetcher,
  fetcher,
  GetByTypeParams,
  GetServerSidePropsPrismicClient,
} from '.';

const contentTypes: ContentType[] = ['articles', 'webcomics'];

type ArticleTypes = RawArticlesDocument | RawWebcomicsDocument;

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...articleFormatsFetchLinks,
  ...contributorFetchLinks,
  ...seriesFetchLinks,
  ...eventsFetchLinks,
];

const articlesFetcher = fetcher<ArticleTypes>(contentTypes, fetchLinks);

export const fetchArticle = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<ArticleTypes | undefined> => {
  const articleDocumentById = await articlesFetcher.getById(client, id);

  // As we have no way of identifiying whether an id is from a webcomic or an article, we have to try both.
  if (!articleDocumentById) {
    const articleDocumentByUID = await fetcher<ArticleTypes>(
      'articles',
      fetchLinks
    ).getByUid(client, id);

    if (!articleDocumentByUID) {
      const webcomicDocumentByUID = await fetcher<ArticleTypes>(
        'webcomics',
        fetchLinks
      ).getByUid(client, id);
      return webcomicDocumentByUID;
    }

    return articleDocumentByUID;
  }

  return articleDocumentById;
};

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
): Promise<prismic.Query<ArticleTypes>> => {
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
