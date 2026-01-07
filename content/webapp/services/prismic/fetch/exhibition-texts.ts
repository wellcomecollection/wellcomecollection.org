import * as prismic from '@prismicio/client';

import { ExhibitionTextsDocument as RawExhibitionTextsDocument } from '@weco/common/prismicio-types';
import { exhibitionsFetchLinks } from '@weco/content/services/prismic/types';

import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';

const exhibitionTextsFetcher = fetcher<RawExhibitionTextsDocument>(
  'exhibition-texts',
  exhibitionsFetchLinks
);

export const fetchExhibitionText = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawExhibitionTextsDocument | undefined> => {
  const exhibitionTextDocument =
    (await exhibitionTextsFetcher.getByUid(client, id)) ||
    (await exhibitionTextsFetcher.getById(client, id));

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
