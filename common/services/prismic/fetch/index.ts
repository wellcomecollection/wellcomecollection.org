import fetch from 'node-fetch';
import * as prismic from '@prismicio/client';

export function createClient(): prismic.Client {
  const endpoint = prismic.getEndpoint('wellcomecollection');
  const client = prismic.createClient(endpoint, { fetch });

  return client;
}
