import { Query } from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from '.';
import { ArticlePrismicDocument } from '../articles';

const fetchLinks = [
  'series.title',
  'article-formats.title',
  'people.name',
  'people.image',
  'people.description',
  'people.sameAs',
  'people.pronouns',
  'organisation.name',
  'editorial-contributor-roles.title',
];

const typeEnum = 'articles';

export async function fetchArticle(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<ArticlePrismicDocument | undefined> {
  const document = await client.getByID<ArticlePrismicDocument>(id, {
    fetchLinks,
  });

  if (document.type === typeEnum) {
    return document;
  }
}

type Params = Parameters<
  GetServerSidePropsPrismicClient['client']['getByType']
>[1];
export async function fetchArticles(
  { client }: GetServerSidePropsPrismicClient,
  params: Params = {}
): Promise<Query<ArticlePrismicDocument>> {
  const document = await client.getByType<ArticlePrismicDocument>(typeEnum, {
    fetchLinks,
    ...params,
  });

  return document;
}

export async function fetchArticlesClientSide(
  params?: Params
): Promise<Query<ArticlePrismicDocument> | undefined> {
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('params', JSON.stringify(params));
  const response = await fetch(`/api/articles?${urlSearchParams.toString()}`);

  if (response.ok) {
    const json = await response.json();
    return json;
  }
}
