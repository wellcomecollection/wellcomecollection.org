import { fetcher, GetByTypeParams, GetServerSidePropsPrismicClient } from '.';
import * as prismic from '@prismicio/client';
import {
  commonPrismicFieldsFetchLinks,
  guideFetchLinks,
  guideFormatsFetchLinks,
  pagesFetchLinks,
} from '@weco/content/services/prismic/types';
import {
  GuidesDocument as RawGuidesDocument,
  GuideFormatsDocument as RawGuideFormatsDocument,
} from '@weco/common/prismicio-types';

const fetchLinks = [
  ...commonPrismicFieldsFetchLinks,
  ...guideFormatsFetchLinks,
  ...guideFetchLinks,
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
  // TODO once redirects are in place we should only fetch by uid
  const guideDocument =
    (await guidesFetcher.getById(client, id)) ||
    (await guidesFetcher.getByUid(client, id));

  return guideDocument;
};

export const fetchGuideFormats = guideFormatsFetcher.getByType;
