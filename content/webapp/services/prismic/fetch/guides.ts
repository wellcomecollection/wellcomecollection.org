import * as prismic from '@prismicio/client';

import {
  GuideFormatsDocument as RawGuideFormatsDocument,
  GuidesDocument as RawGuidesDocument,
} from '@weco/common/prismicio-types';
import {
  commonPrismicFieldsFetchLinks,
  guideFetchLinks,
  guideFormatsFetchLinks,
  pagesFetchLinks,
  teamsFetchLinks,
} from '@weco/content/services/prismic/types';

import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...guideFormatsFetchLinks,
  ...guideFetchLinks,
  ...teamsFetchLinks,
];

const guidesFetcher = fetcher<RawGuidesDocument>('guides', fetchLinks);
const guideFormatsFetcher = fetcher<RawGuideFormatsDocument>(
  'guide-formats',
  []
);

type GuidesQueryProps = GetByTypeParams & {
  format?: string;
};

export const fetchGuides = (
  client: GetServerSidePropsPrismicClient,
  { format, ...opts }: GuidesQueryProps
): Promise<prismic.Query<RawGuidesDocument>> => {
  const formatFilters = format
    ? [prismic.filter.at('my.guides.format', format)]
    : [];

  return guidesFetcher.getByType(client, {
    filters: formatFilters,
    fetchLinks: pagesFetchLinks,
    ...opts,
  });
};
export const fetchGuide = async (
  client: GetServerSidePropsPrismicClient,
  id: string
): Promise<RawGuidesDocument | undefined> => {
  const guideDocument =
    (await guidesFetcher.getByUid(client, id)) ||
    (await guidesFetcher.getById(client, id));

  return guideDocument;
};

export const fetchGuideFormats = guideFormatsFetcher.getByType;
