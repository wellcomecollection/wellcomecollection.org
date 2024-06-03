import * as prismic from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionHighlightToursDocument } from '@weco/common/prismicio-types';
import { exhibitionsFetchLinks } from '../types';

const exhibitionHighlightToursFetcher =
  fetcher<ExhibitionHighlightToursDocument>(
    'exhibition-highlight-tours',
    exhibitionsFetchLinks
  );

export const fetchExhibitionHighlightTour =
  exhibitionHighlightToursFetcher.getById;

export const fetchExhibitionHighlightTours = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<prismic.Query<ExhibitionHighlightToursDocument>> => {
  return exhibitionHighlightToursFetcher.getByType(client, {
    fetchLinks: exhibitionsFetchLinks,
    ...opts,
  });
};
