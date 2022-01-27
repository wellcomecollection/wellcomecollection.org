// TODO: It should be possible to drastically simplify this by using a vanilla
// fetcher, and passing multiple content types (cf. pages.ts).
//
// For some reason, whenever I try using it (or adding any fetcher to this file),
// I get an error from the type checker:
//
//      ../../node_modules/prismic-client-beta/dist/index.mjs
//      Attempted import error: 'asLink' is not exported from '@prismicio/helpers' (imported as 'prismicH').
//
// e.g. the following line, which we know works because it compiles perfectly in
// another file:
//
//      const booksFetcher = fetcher<BookPrismicDocument>('books', fetchLinks);
//
// will cause the error.
//
// I've given up trying to fix this today, but we should come back and resolve it
// rather than putting new logic in this file.
//
// This may get fixed when we update our Prismic API client libraries.
// See https://github.com/wellcomecollection/wellcomecollection.org/issues/7595

import { Query } from '@prismicio/types';
import { GetServerSidePropsPrismicClient } from '.';
import { ArticlePrismicDocument, articlesFetchLinks } from '../types/articles';
import { graphQuery } from '@weco/common/services/prismic/articles';

const fetchLinks = articlesFetchLinks;

// For other types we use fetcher.getById (see e.g. books.ts).
//
// That method looks for matching documents with a single type (e.g. document.type === 'books');
// because an article can have two types, we can't use that here.
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
  const orderings = ['document.first_publication_date desc'];
  
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
    orderings,
    graphQuery,
    ...params,
    predicates: [articleAndWebcomicPredicate, ...(params.predicates ?? [])],
  });

  return document;
}

export async function fetchArticlesClientSide(
  params?: Params
): Promise<Query<ArticlePrismicDocument> | undefined> {
  // If you add more parameters here, you have to update the corresponding cache behaviour
  // in the CloudFront distribution, or you may get incorrect behaviour.
  //
  // e.g. at one point we forgot to include the "params" query in the cache key,
  // so every article was showing the same set of related stories.
  //
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues
  const urlSearchParams = new URLSearchParams();
  urlSearchParams.set('params', JSON.stringify(params));
  const response = await fetch(`/api/articles?${urlSearchParams.toString()}`);

  if (response.ok) {
    const json = await response.json();
    return json;
  }
}
