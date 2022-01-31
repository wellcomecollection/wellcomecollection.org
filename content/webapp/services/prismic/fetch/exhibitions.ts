import { fetcher, GetServerSidePropsPrismicClient } from '.';
import { ExhibitionPrismicDocument } from '../types/exhibitions';
import { Query } from '@prismicio/types';
import { fetchPages } from './pages';
import * as prismic from 'prismic-client-beta';
import { PagePrismicDocument } from '../types/pages';
import {
  exhibitionFields,
  exhibitionResourcesFields,
  placesFields,
  eventSeriesFields,
  organisationsFields,
  peopleFields,
  contributorsFields,
  articlesFields,
  eventsFields,
  seasonsFields,
} from '@weco/common/services/prismic/fetch-links';

const fetchLinks = peopleFields.concat(
  exhibitionFields,
  organisationsFields,
  contributorsFields,
  placesFields,
  exhibitionResourcesFields,
  eventSeriesFields,
  articlesFields,
  eventsFields,
  seasonsFields
);

const exhibitionsFetcher = fetcher<ExhibitionPrismicDocument>(
  'exhibitions',
  fetchLinks
);

export type FetchExhibitionResult = {
  exhibition?: ExhibitionPrismicDocument;
  pages: Query<PagePrismicDocument>;
};

export async function fetchExhibition(
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<FetchExhibitionResult> {
  const exhibitionPromise = exhibitionsFetcher.getById(client, id);
  const pageQueryPromise = fetchPages(
    client,
    {
      predicates: [prismic.predicate.at('my.pages.parents.parent', id)],
    }
  );

  const [exhibition, pages] = await Promise.all([
    exhibitionPromise,
    pageQueryPromise,
  ]);

  return {
    exhibition,
    pages,
  }
}

export const fetchExhibitions = exhibitionsFetcher.getByType;
export const fetchExhibitionsClientSide =
  exhibitionsFetcher.getByTypeClientSide;
