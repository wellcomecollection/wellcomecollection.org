import { Query, PrismicDocument } from '@prismicio/types';
import * as prismic from 'prismic-client-beta';
import fetch from 'node-fetch';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import { ContentType } from '../link-resolver';
import { isString } from '@weco/common/utils/array';

const endpoint = prismic.getEndpoint('wellcomecollection');
const client = prismic.createClient(endpoint, { fetch });

export type GetServerSidePropsPrismicClient = {
  type: 'GetServerSidePropsPrismicClient';
  client: prismic.Client;
};

const delistPredicate = prismic.predicate.not('document.tags', ['delist']);

/**
 * We require the `GetServerSidePropsContext` or `NextApiRequest` here to esure that
 * the client is being created at the entry-edge of our application.
 *
 * This allows us to generate 1 client on the edge, and pass it through to multiple
 * fetching methods e.g.
 *
 * export const getServerSideProps = async context => {
 *    const client = createClient(context)
 *    const articles = await getArticles(client)
 *    const events = await getEvents(client)
 * }
 *
 * Or from an API route {@link https://nextjs.org/docs/api-routes/introduction}
 *
 * export default async (req: NextApiRequest, res: NextApiResponse) => {
 *   const client = createClient({ req });
 *    // ...
 * }
 *
 * What this doesn't avoid us doing as it seems like you would have to go out
 * of your way to implement the anti-pattern is:
 *
 * async function getArticles(context: GetServerSidePropsContext) {
 *   const { client } = createClient(context);
 *   return client.getArticles();
 * }
 * async function getEvents(context: GetServerSidePropsContext) {
 *   const { client } = createClient(context);
 *   return client.getArticles();
 * }
 * export const getServerSideProps = async context => {
 *    const articles = await getArticles(context)
 *    const events = await getEvents(context)
 * }
 */
export function createClient(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  { req }: GetServerSidePropsContext | { req: NextApiRequest }
): GetServerSidePropsPrismicClient {
  client.enableAutoPreviewsFromReq(req);
  return { type: 'GetServerSidePropsPrismicClient', client };
}

export type GetByTypeParams = Parameters<
  GetServerSidePropsPrismicClient['client']['getByType']
>[1];

export function fetcher<Document extends PrismicDocument>(
  contentType: ContentType | ContentType[],
  fetchLinks: string[]
) {
  return {
    getById: async (
      { client }: GetServerSidePropsPrismicClient,
      id: string
    ): Promise<Document | undefined> => {
      try {
        // This means that Prismic will only return the document with the given ID if
        // it matches the content type.  So e.g. going to /events/<exhibition ID> will
        // return a 404, rather than a 500 as we find we're missing a bunch of fields
        // we need to render the page.
        const predicates =
          isString(contentType) 
            ? [prismic.predicate.at('document.type', contentType)]
            : [prismic.predicate.any('document.type', contentType)];

        return await client.getByID<Document>(id, {
          fetchLinks,
          predicates,
        });
      } catch {}
    },

    /** Get all the documents of a given type.
      * 
      * If `contentType` is an array, this fetches all the documents of any specified type.
      * This is useful if we use the same fetch/transform method for multiple documents with
      * different types in Prismic, e.g. articles which could be 'article' or 'webcomic'.
      */
    getByType: async (
      { client }: GetServerSidePropsPrismicClient,
      params: GetByTypeParams = {}
    ): Promise<Query<Document>> => {
      const predicates = isString(params.predicates)
        ? [params.predicates]
        : Array.isArray(params.predicates)
        ? params.predicates
        : [];

      const response =
        isString(contentType)
          ? await client.getByType<Document>(contentType, {
            ...params,
            fetchLinks,
            predicates: [...predicates, delistPredicate],
          })
          : await client.get<Document>({
            ...params,
            fetchLinks,
            predicates: [
              ...predicates,
              delistPredicate,
              prismic.predicate.any('document.type', contentType),
            ],
          });

      return response;
    },

    getByTypeClientSide: async (
      params?: GetByTypeParams
    ): Promise<Query<Document> | undefined> => {
      // If you add more parameters here, you have to update the corresponding cache behaviour
      // in the CloudFront distribution, or you may get incorrect behaviour.
      //
      // e.g. at one point we forgot to include the "params" query in the cache key,
      // so every article was showing the same set of related stories.
      //
      // See https://github.com/wellcomecollection/wellcomecollection.org/issues
      const urlSearchParams = new URLSearchParams();
      urlSearchParams.set('params', JSON.stringify(params));

      const url =
        isString(contentType)
          ? `/api/${contentType[0]}?${urlSearchParams.toString()}`
          : `/api/${contentType}?${urlSearchParams.toString()}`;

      const response = await fetch(url);

      if (response.ok) {
        const json: Query<Document> = await response.json();
        return json;
      }
    },
  };
}
