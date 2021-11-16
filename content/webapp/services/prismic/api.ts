import Prismic from '@prismicio/client';
import { Document } from '@prismicio/client/types/documents';
import ResolvedApi from '@prismicio/client/types/ResolvedApi';
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

type PrismicTypesDocument<Data> = Document & {
  data: Data;
};

export async function getDocument<Data>(
  prismic: ResolvedApi,
  id: string
): Promise<PrismicTypesDocument<Data>> {
  const document = await prismic.getByID(id);
  return document;
}
// export type GetDocument = (Parameters<typeof getDocument>) => Prismic;
