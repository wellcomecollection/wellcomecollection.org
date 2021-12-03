import * as prismic from 'prismic-client-beta';
import fetch from 'node-fetch';
import { GetServerSidePropsContext, NextApiRequest } from 'next';

const endpoint = prismic.getEndpoint('wellcomecollection');
const client = prismic.createClient(endpoint, { fetch });

export type GetServerSidePropsPrismicClient = {
  type: 'GetServerSidePropsPrismicClient';
  client: prismic.Client;
};

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
 * Or from an API endpoint
 *
 * export default async (req: NextApiRequest, res: NextApiResponse) => {
 *   const client = createClient(req);
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
  _: GetServerSidePropsContext | NextApiRequest
): GetServerSidePropsPrismicClient {
  if ('req' in _) {
    client.enableAutoPreviewsFromReq(_.req);
  }
  return { type: 'GetServerSidePropsPrismicClient', client };
}
