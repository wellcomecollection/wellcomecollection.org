import * as prismic from 'prismic-client-beta';
import { PrismicDocument } from '@prismicio/types';
import { GetServerSidePropsContext } from 'next';
import fetch from 'node-fetch';

type Req = GetServerSidePropsContext['req'];

const routes = [
  {
    type: 'seasons',
    path: '/seasons/:uid',
  },
];
const endpoint = prismic.getEndpoint('wellcomecollection');
const client = prismic.createClient(endpoint, { routes, fetch });

// We enforce have a req object as we should never be using the API on the client.
// To fetch stuff via the client, use the ./api paths.
// The API should only ever be initialised once per request, usually the entry point
// of the page of the page e.g. `getServerSideProperties`.
const initialised = false;
export function api(req: Req): prismic.Client {
  if (!req) {
    throw Error('Give me a req');
  }
  if (initialised) {
    throw Error(
      'Prismic has already been initialised, please use the previously initialised API reference'
    );
  }

  initialised = true;
  return client;
}

export async function getDocument<Doc extends PrismicDocument>(
  client: prismic.Client,
  id: string
): Promise<Doc> {
  const document = await client.getByID<Doc>(id);

  return document;
}
