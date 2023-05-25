import { Query } from '@prismicio/client';
import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import {
  GuidePrismicDocument,
  GuideFormatPrismicDocument,
} from '../types/guides';
import * as prismic from '@prismicio/client';
import { fetchLinks as pagesFetchLinks } from './pages';

const fetchLinks = [];

const guidesFetcher = fetcher<GuidePrismicDocument>('guides', fetchLinks);
const guideFormatsFetcher = fetcher<GuideFormatPrismicDocument>(
  'guide-formats',
  []
);

type GuidesQueryProps = GetByTypeParams & {
  format?: string;
};

export const fetchGuides = (
  client: GetServerSidePropsPrismicClient,
  { format, ...opts }: GuidesQueryProps
): Promise<Query<GuidePrismicDocument>> => {
  const formatFilters = format
    ? [prismic.filter.at('my.guides.format', format)]
    : [];

  return guidesFetcher.getByType(client, {
    filters: formatFilters,
    fetchLinks: pagesFetchLinks,
    ...opts,
  });
};

export const fetchGuideFormats = guideFormatsFetcher.getByType;
