import * as prismic from '@prismicio/client';
import {
  GetServerSidePropsPrismicClient,
  GetByTypeParams,
  fetcher,
  clientSideFetcher,
} from '.';
import {
  ArticlesDocument as RawArticlesDocument,
  WebcomicsDocument as RawWebcomicsDocument,
} from '@weco/common/prismicio-types';
import { ContentType } from '@weco/common/services/prismic/content-types';
import { ArticleBasic } from '@weco/content/types/articles';
import {
  articleFormatsFetchLinks,
  commonPrismicFieldsFetchLinks,
  contributorFetchLinks,
  seriesFetchLinks,
  eventsFetchLinks,
} from '@weco/content/services/prismic/types';

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
  // TODO once redirects are in place we should only fetch by uid
  const articleDocumentById = await articlesFetcher.getById(client, id);

  // TODO
  // How do we do it for webcomics as they use the same prefix (`/articles`) as Articles.
  // So how do we pass the correct content type in?
  // It's awful to just try it twice...
  const articleDocumentByUID = await fetcher<ArticleTypes>(
    'articles',
    fetchLinks
  ).getByUid(client, id);

  const webcomicDocumentByUID = await fetcher<ArticleTypes>(
    'webcomics',
    fetchLinks
  ).getByUid(client, id);

  return articleDocumentById || articleDocumentByUID || webcomicDocumentByUID;
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
