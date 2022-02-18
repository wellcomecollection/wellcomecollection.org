import { Query } from '@prismicio/types';
import { PrismicQueryOpts } from '@weco/common/services/prismic/types';
import { fetcher, GetServerSidePropsPrismicClient } from '.';
import {
  GuidePrismicDocument,
  GuideFormatPrismicDocument,
} from '../types/guides';
import * as prismic from 'prismic-client-beta';
import { fetchLinks as pagesFetchLinks } from './pages';

const fetchLinks = [];

const guidesFetcher = fetcher<GuidePrismicDocument>('guides', fetchLinks);
const guideFormatsFetcher = fetcher<GuideFormatPrismicDocument>(
  'guide-formats',
  []
);

type GuidesQueryProps = PrismicQueryOpts & {
  format?: string | string[];
};

export const fetchGuides = (
  client: GetServerSidePropsPrismicClient,
  { format, ...opts }: GuidesQueryProps
): Promise<Query<GuidePrismicDocument>> => {
  const formatPredicates = format
    ? [prismic.predicate.at('my.guides.format', format)]
    : [];

  return guidesFetcher.getByType(client, {
    predicates: formatPredicates,
    fetchLinks: pagesFetchLinks,
    ...opts,
  });
};

export const fetchGuideFormats = guideFormatsFetcher.getByType;
