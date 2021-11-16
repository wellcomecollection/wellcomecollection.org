import Prismic from '@prismicio/client';
import ResolvedApi from '@prismicio/client/types/ResolvedApi';
import { PrismicDocument } from '@prismicio/types';
import { GetServerSidePropsContext } from 'next';

type Req = GetServerSidePropsContext['req'];

// We enforce have a req object as we should never be using this method in the client.
// To fetch stuff via the client, use the ./api paths.
let initialised = false;
export async function api(req: Req): Promise<ResolvedApi> {
  if (initialised) {
    throw Error(
      'Prismic has already been initialised, please use the previously initialised API reference'
    );
  }

  const api = await Prismic.getApi('https://wellcomecollection.prismic.io', {
    req,
  });

  initialised = true;

  return api;
}

type ModdedPrismicDocument<Data> = Omit<
  PrismicDocument<Data>,
  'linked_documents'
>;

export async function getDocument<Data>(
  prismic: ResolvedApi,
  id: string
): Promise<ModdedPrismicDocument<Data>> {
  const document = await prismic.getByID(id);

  return {
    ...document,
    uid: document.uid ?? null,
    url: document.url ?? null,
    // These are always returned as strings and reflected as such in @prismicio/types
    // but not the @prismicio/client
    lang: document.lang as string,
    first_publication_date: document.first_publication_date as string,
    last_publication_date: document.first_publication_date as string,
  };
}
