import { Query } from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from '.';
import { ArticlePrismicDocument } from '../articles';

// This is for the outro links
const documentLinkTypes = [
  'pages',
  'event-series',
  'books',
  'events',
  'articles',
  'exhibitions',
  'series',
  'webcomic-series',
].flatMap(type => [`${type}.title`, `${type}.promo`]);

const fetchLinks = [
  ...documentLinkTypes,
  'article-formats.title',
  'people.name',
  'people.image',
  'people.description',
  'people.sameAs',
  'people.pronouns',
  'organisation.name',
  'editorial-contributor-roles.title',
];

export async function fetchArticle(
  { client }: GetServerSidePropsPrismicClient,
  id: string
): Promise<ArticlePrismicDocument | undefined> {
  try {
    const document = await client.getByID<ArticlePrismicDocument>(id, {
      fetchLinks,
    });

    if (document.type === 'articles' || document.type === 'webcomics') {
      return document;
    }
  } catch {}
}

type Params = Parameters<
  GetServerSidePropsPrismicClient['client']['getByType']
>[1];
export async function fetchArticles(
  { client }: GetServerSidePropsPrismicClient,
  params: Params = {}
): Promise<Query<ArticlePrismicDocument>> {
  /**
   * articles and webcomics share the same functionality as we
   * can't change the types of documents in Prismic.
   *
   * We thus have to fetch both here
   * {@link} https://community.prismic.io/t/import-export-change-type-of-imported-document/7814
   */
  const articleAndWebcomicPredicate =
    '[any(document.type, ["articles", "webcomics"])]';

  const document = await client.get<ArticlePrismicDocument>({
    fetchLinks,
    ...params,
    predicates: [articleAndWebcomicPredicate, ...(params.predicates ?? [])],
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
