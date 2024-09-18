import * as prismic from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionHighlightToursDocument as RawExhibitionHighlightToursDocument } from '@weco/common/prismicio-types';
import { exhibitionsFetchLinks } from '@weco/content/services/prismic/types';

const exhibitionHighlightToursFetcher =
  fetcher<RawExhibitionHighlightToursDocument>(
    'exhibition-highlight-tours',
    exhibitionsFetchLinks
  );

export const fetchExhibitionHighlightTour = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawExhibitionHighlightToursDocument | undefined> => {
  // TODO once redirects are in place we should only fetch by uid
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
