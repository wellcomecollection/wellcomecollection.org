import * as prismic from '@prismicio/client';

import { ExhibitionHighlightToursDocument as RawExhibitionHighlightToursDocument } from '@weco/common/prismicio-types';
import { exhibitionsFetchLinks } from '@weco/content/services/prismic/types';

import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';

const exhibitionHighlightToursFetcher =
  fetcher<RawExhibitionHighlightToursDocument>(
    'exhibition-highlight-tours',
    exhibitionsFetchLinks
  );

export const fetchExhibitionHighlightTour = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawExhibitionHighlightToursDocument | undefined> => {
  const exhibitionHighlightTourDocument =
    (await exhibitionHighlightToursFetcher.getByUid(client, id)) ||
    (await exhibitionHighlightToursFetcher.getById(client, id));

  return exhibitionHighlightTourDocument;
};

export const fetchExhibitionHighlightTours = (
  client: GetServerSidePropsPrismicClient,
  { ...opts }: GetByTypeParams
): Promise<prismic.Query<RawExhibitionHighlightToursDocument>> => {
  return exhibitionHighlightToursFetcher.getByType(client, {
    fetchLinks: exhibitionsFetchLinks,
    ...opts,
  });
};
