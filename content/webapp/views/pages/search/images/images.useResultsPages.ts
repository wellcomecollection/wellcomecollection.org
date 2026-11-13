import { useRef, useState } from 'react';

import { useFeatureFlags, useModes } from '@weco/common/server-data/Context';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { ImagesProps } from '@weco/content/views/components/SearchPagesLink/Images';

/**
 * Fetches other pages of the current image search in the browser, with the
 * same parameters the server uses, so the sidebar can step from the last image
 * on one page to the first on the next (or back) without waiting. Each page is
 * fetched once per search. A page that couldn't be fetched is reported, so
 * stepping to it can be disabled.
 */
const useResultsPages = (imagesRouteProps: ImagesProps, pageSize: number) => {
  const { stagingApi } = useFeatureFlags();
  const { cataloguePipeline } = useModes();
  const requests = useRef(new Map<string, Promise<Image[] | undefined>>());
  const [failedPages, setFailedPages] = useState<Set<string>>(new Set());

  // The whole search as well as the page, so a new search starts again
  const keyFor = (page: number) =>
    JSON.stringify({ ...imagesRouteProps, page });

  const fetchPage = (page: number): Promise<Image[] | undefined> => {
    const key = keyFor(page);
    const existing = requests.current.get(key);
    if (existing) return existing;

    const request = getImages({
      params: {
        ...imagesRouteProps,
        // As the server does, for the colour from the no-JavaScript colour input
        color: imagesRouteProps.color?.replace('#', ''),
        page,
      },
      shouldUseStagingApi: stagingApi,
      pipelineCluster: cataloguePipeline,
      pageSize,
    }).then(response => {
      if (response.type === 'ResultList' && response.results.length > 0) {
        return response.results;
      }

      setFailedPages(failed => new Set(failed).add(key));
      return undefined;
    });

    requests.current.set(key, request);
    return request;
  };

  const hasFailed = (page: number) => failedPages.has(keyFor(page));

  return { fetchPage, hasFailed };
};

export default useResultsPages;
