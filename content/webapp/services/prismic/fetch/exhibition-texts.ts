import * as prismic from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionTextsDocument } from '@weco/common/prismicio-types';
import { exhibitionsFetchLinks } from '../types';

const exhibitionTextsFetcher = fetcher<ExhibitionTextsDocument>(
  'exhibition-texts',
  exhibitionsFetchLinks
);

export const fetchExhibitionText = exhibitionTextsFetcher.getById;

export const fetchExhibitionTexts = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<prismic.Query<ExhibitionTextsDocument>> => {
  return exhibitionTextsFetcher.getByType(client, {
    fetchLinks: exhibitionsFetchLinks,
    ...opts,
  });
};
