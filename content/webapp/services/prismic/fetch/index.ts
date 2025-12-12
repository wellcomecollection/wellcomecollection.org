import * as prismic from '@prismicio/client';
import { GetServerSidePropsContext, NextApiRequest } from 'next';
import fetch from 'node-fetch';

import { SiteSection } from '@weco/common/model/site-section';
import {
  ContentType,
  isContentType,
} from '@weco/common/services/prismic/content-types';
import { createClient as createPrismicClient } from '@weco/common/services/prismic/fetch';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { deserialiseDates as deserialiseJsonDates } from '@weco/common/utils/json';
import { toMaybeString } from '@weco/common/utils/routes';
import { isString } from '@weco/common/utils/type-guards';

export type GetServerSidePropsPrismicClient = {
  type: 'GetServerSidePropsPrismicClient';
  client: prismic.Client;
};

export const delistFilter = prismic.filter.not('document.tags', ['delist']);

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

const clientMemo: { prod?: prismic.Client; stage?: prismic.Client } = {
  stage: undefined,
  prod: undefined,
};

function getClient(env: 'stage' | 'prod'): prismic.Client {
  if (!clientMemo[env]) {
    clientMemo[env] = createPrismicClient(env === 'stage');
  }

  return clientMemo[env] as prismic.Client;
}

export function createClient({
  req,
}:
  | GetServerSidePropsContext
  | { req: NextApiRequest }): GetServerSidePropsPrismicClient {
  const isPrismicStage = req.cookies?.toggle_prismicStage === 'true';
  const client = getClient(isPrismicStage ? 'stage' : 'prod');

  client.enableAutoPreviewsFromReq(req);

  return { type: 'GetServerSidePropsPrismicClient', client };
}

export type GetByTypeParams = Parameters<
  GetServerSidePropsPrismicClient['client']['getByType']
>[1];

export function fetcher<Document extends prismic.PrismicDocument>(
  contentType: ContentType | ContentType[],
  fetchLinks: string[]
) {
  return {
    getById: async (
      { client }: GetServerSidePropsPrismicClient,
      id: string,
      params?: { graphQuery?: string }
    ): Promise<Document | undefined> => {
      try {
        // This means that Prismic will only return the document with the given ID if
        // it matches the content type.  So e.g. going to /events/<exhibition ID> will
        // return a 404, rather than a 500 as we find we're missing a bunch of fields
        // we need to render the page.
        const filters = isString(contentType)
          ? [prismic.filter.at('document.type', contentType)]
          : [prismic.filter.any('document.type', contentType)];

        return await client.getByID<Document>(
          id,
          params?.graphQuery
            ? {
                graphQuery: params?.graphQuery,
              }
            : {
                fetchLinks,
                filters,
              }
        );
      } catch (e) {
        console.warn(e);
      }
    },

    /** Get all the documents of a given type.
     *
     * If `contentType` is an array, this fetches all the documents of any specified type.
     * This is useful if we use the same fetch/transform method for multiple documents with
     * different types in Prismic, e.g. articles which could be 'article' or 'webcomic'.
     */
    getByType: async (
      { client }: GetServerSidePropsPrismicClient,
      params: GetByTypeParams = {},
      hasDelistFilter = true
    ): Promise<prismic.Query<Document>> => {
      const paramsFilters = isString(params.filters)
        ? [params.filters]
        : Array.isArray(params.filters)
          ? params.filters
          : [];

      const filters = [
        ...paramsFilters,
        hasDelistFilter ? delistFilter : '',
      ].filter(f => f);

      const response = isString(contentType)
        ? await client.getByType<Document>(contentType, {
            ...params,
            fetchLinks,
            filters,
          })
        : await client.get<Document>({
            ...params,
            fetchLinks,
            filters: [
              ...filters,
              prismic.filter.any('document.type', contentType),
            ],
          });

      return response;
    },

    getByUid: async (
      { client }: GetServerSidePropsPrismicClient,
      uid: string,
      // 'orphan' is only ever used in this context,
      // so I'm keeping it separate from SiteSection which is used in other contexts.
      siteSection?: SiteSection | 'orphan',
      params?: { graphQuery?: string }
    ): Promise<Document | undefined> => {
      try {
        const primaryContentType = toMaybeString(contentType);

        if (!isContentType(primaryContentType)) return;

        const response = await client.getByUID<Document>(
          primaryContentType,
          uid,
          params?.graphQuery
            ? {
                graphQuery: params?.graphQuery,
              }
            : {
                fetchLinks,
                filters: siteSection
                  ? [
                      prismic.filter.any(
                        'document.tags',
                        siteSection === 'orphan' ? [] : [siteSection]
                      ),
                    ]
                  : [],
              }
        );

        return response;
      } catch {
        // Ideally we would send something to our dashboard that would flag
        // if the same error came back again and again.
        // But we don't need this to error every time as it can just be a randomly inputted URL.
      }
    },
  };
}

export async function fetchFromClientSide<T>({
  endpoint,
  params,
}: {
  endpoint: string;
  params: unknown;
}): Promise<T | undefined> {
  // If you add more parameters here, you have to update the corresponding cache behaviour
  // in the CloudFront distribution, or you may get incorrect behaviour.
  //
  // e.g. at one point we forgot to include the "params" query in the cache key,
  // so every article was showing the same set of related stories.
  //
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7461
  const urlSearchParams = new URLSearchParams();

  urlSearchParams.set(
    'params',
    isString(params) ? params : JSON.stringify(params)
  );

  const url = `/api/${endpoint}?${urlSearchParams.toString()}`;

  const response = await fetch(url);

  if (response.ok) {
    const json = await response.json();
    return deserialiseJsonDates(json);
  }
}

export function clientSideFetcher<TransformedDocument>(endpoint: string) {
  return {
    /** Get all the documents of a given type.
     *
     * This makes a request to the /api endpoint for the given document type.
     * If you use one of these methods, you will need to add a corresponding route
     * in 'pages/api' (see e.g. 'pages/api/articles/index.ts'), which calls the
     * appropriate fetch method.
     */
    getByTypeClientSide: async (
      params?: GetByTypeParams
    ): Promise<PaginatedResults<TransformedDocument> | undefined> => {
      return fetchFromClientSide({ endpoint, params });
    },
  };
}
