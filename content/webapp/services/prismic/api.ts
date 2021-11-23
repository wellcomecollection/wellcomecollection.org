import * as prismic from 'prismic-client-beta';
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

// `req` is required as we should never be using the API on the client.
// To fetch Prismic content asynchronously via the client, use the ./api paths.
// The API should only ever be initialised once per request, usually the entry point
// of the page e.g. `getServerSideProperties`.
let initialised = false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function api(req: Req): prismic.Client {
  if (initialised) {
    throw Error(
      'Prismic has already been initialised, please use the previously initialised API reference'
    );
  }

  initialised = true;
  return client;
}
