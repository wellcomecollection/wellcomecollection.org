import * as prismic from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionTextsDocument as RawExhibitionTextsDocument } from '@weco/common/prismicio-types';
import { exhibitionsFetchLinks } from '../types';

const exhibitionTextsFetcher = fetcher<RawExhibitionTextsDocument>(
  'exhibition-texts',
  exhibitionsFetchLinks
);

export const fetchExhibitionText = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawExhibitionTextsDocument | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
  const exhibitionTextDocument =
    (await exhibitionTextsFetcher.getById(client, id)) ||
    (await exhibitionTextsFetcher.getByUid(client, id));

  return exhibitionTextDocument;
};

export const fetchExhibitionTexts = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<prismic.Query<RawExhibitionTextsDocument>> => {
  return exhibitionTextsFetcher.getByType(client, {
    fetchLinks: exhibitionsFetchLinks,
    ...opts,
  });
};
