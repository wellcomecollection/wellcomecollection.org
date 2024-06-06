import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import * as prismic from '@prismicio/client';
import { pagesFetchLinks } from '@weco/content/services/prismic/types';
import {
  GuidesDocument,
  GuideFormatsDocument,
} from '@weco/common/prismicio-types';

const fetchLinks = [];

const guidesFetcher = fetcher<GuidesDocument>('guides', fetchLinks);
const guideFormatsFetcher = fetcher<GuideFormatsDocument>('guide-formats', []);

type GuidesQueryProps = GetByTypeParams & {
  format?: string;
};

export const fetchGuides = (
  client: GetServerSidePropsPrismicClient,
  { format, ...opts }: GuidesQueryProps
): Promise<prismic.Query<GuidesDocument>> => {
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
