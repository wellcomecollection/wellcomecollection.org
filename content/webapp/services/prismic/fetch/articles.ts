import { Query } from '@prismicio/types';
import { GetServerSidePropsPrismicClient, GetByTypeParams, fetcher } from '.';
import { ArticlePrismicDocument, articlesFetchLinks } from '../types/articles';
import { ContentType } from '../link-resolver';

const contentTypes = ['articles', 'webcomics'];
const fetchLinks = articlesFetchLinks;

const articlesFetcher = fetcher<ArticlePrismicDocument>(contentTypes as ContentType[], fetchLinks);

export const fetchArticle = articlesFetcher.getById;

export const fetchArticles = (
  client: GetServerSidePropsPrismicClient,
  params: GetByTypeParams = {}
): Promise<Query<ArticlePrismicDocument>> => {
  return articlesFetcher.getByType(client, {
    ...params,
    orderings: [
      { field: 'document.first_publication_date', direction: 'desc' },
    ],
  });
};
export const fetchArticlesClientSide = articlesFetcher.getByTypeClientSide;
