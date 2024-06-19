import * as prismic from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionTextsDocument as RawExhibitionTextsDocument } from '@weco/common/prismicio-types';
import { exhibitionsFetchLinks } from '../types';

const exhibitionTextsFetcher = fetcher<RawExhibitionTextsDocument>(
  'exhibition-texts',
  exhibitionsFetchLinks
);

export const fetchExhibitionText = exhibitionTextsFetcher.getById;

export const fetchExhibitionTexts = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<prismic.Query<RawExhibitionTextsDocument>> => {
  return exhibitionTextsFetcher.getByType(client, {
    fetchLinks: exhibitionsFetchLinks,
    ...opts,
  });
};
