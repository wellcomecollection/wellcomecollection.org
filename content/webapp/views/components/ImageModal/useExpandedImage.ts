import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { useFeatureFlags, useModes } from '@weco/common/server-data/Context';
import useUrlHash from '@weco/content/hooks/useUrlHash';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

type SetExpandedImageOptions = {
  // Replaces the history entry rather than adding one, e.g. when stepping
  // through the results, so Back doesn't go through every image
  replace?: boolean;
  // Scrolls the page only as far as needed to show the image's thumbnail,
  // rather than keeping it where it is
  scrollToThumbnail?: boolean;
  // Goes to this page of results as well, for an image on another page. The
  // image stays as it was until that page has loaded.
  page?: number;
};

export type SetExpandedImage = (
  image: Image | undefined,
  options?: SetExpandedImageOptions
) => void;

// Not smooth: the results re-render once the URL has changed, and in Chrome
// that can cancel a smooth scroll partway, leaving the thumbnail out of view
const scrollThumbnailIntoView = (imageId: string) =>
  document.getElementById(imageId)?.scrollIntoView({ block: 'nearest' });

/**
 * The image open in the modal or sidebar. The URL's hash is the only record of
 * which one it is, so the browser's Back and Forward, links with an image's id
 * in them, and every instance of this hook on a page agree. Setting it goes
 * through Next's router, which keeps the history right.
 */
const useExpandedImage = (
  images: Image[]
): [Image | undefined, SetExpandedImage] => {
  const router = useRouter();
  const imageId = useUrlHash(router.asPath);
  const { stagingApi } = useFeatureFlags();
  const { cataloguePipeline } = useModes();

  // The URL only has the image's id, but the modal and sidebar need the whole
  // image (title, thumbnail, work...). Most of the time it's one of the results,
  // so it's looked up here rather than fetched. Images from earlier pages are
  // kept too, so the image stays open, and doesn't flash, while the next page of
  // results loads.
  const seenImages = useRef<Record<string, Image>>({});
  images.forEach(image => {
    seenImages.current[image.id] = image;
  });

  // An image we haven't seen, e.g. from a link or the visually similar images,
  // has to be fetched
  const [fetchedImage, setFetchedImage] = useState<Image | undefined>();
  const isSeen = Boolean(imageId && seenImages.current[imageId]);

  useEffect(() => {
    if (!imageId || isSeen) return;

    // If the image changes while this is still loading, the late response is
    // ignored, so it can't replace the newer image
    let isCancelled = false;
    getImage({
      id: imageId,
      shouldUseStagingApi: stagingApi,
      pipelineCluster: cataloguePipeline,
    }).then(({ image }) => {
      if (!isCancelled && image.type === 'Image') setFetchedImage(image);
    });

    return () => {
      isCancelled = true;
    };
  }, [imageId, isSeen]);

  // Seen first, then fetched, and only if it's the one the URL has
  const expandedImage = imageId
    ? (seenImages.current[imageId] ??
      (fetchedImage?.id === imageId ? fetchedImage : undefined))
    : undefined;

  // Callbacks registered once, like the Escape listeners, keep an old
  // `setExpandedImage`, so it reads the latest router and id from here
  const latest = useRef({ router, imageId });
  latest.current = { router, imageId };

  const setExpandedImage: SetExpandedImage = (
    image,
    { replace = false, scrollToThumbnail = false, page } = {}
  ) => {
    const { router, imageId } = latest.current;

    // Already open: pushing the same URL again would add a history entry
    if (image?.id === imageId) return;

    // Keeps an image we already have (e.g. a visually similar one) open while
    // the URL changes, rather than fetching it again
    if (image) seenImages.current[image.id] = image;

    const [path] = router.asPath.split('#');
    const { scrollY } = window;
    const navigate = (replace ? router.replace : router.push).bind(router);

    // Another page of results needs its server-side props, so isn't shallow.
    // The URL is built the way the pagination's links build it, but without
    // `page` for the first page: the pagination takes `?page=1` out of the URL
    // itself, which scrolls the page to the thumbnail, moving it to the top.
    const { page: _currentPage, ...otherQuery } = router.query;
    const navigation =
      image && page
        ? navigate(
            {
              pathname: router.pathname,
              query: page === 1 ? otherQuery : { ...otherQuery, page },
              hash: image.id,
            },
            undefined,
            { scroll: false }
          )
        : navigate(
            { pathname: router.pathname, query: router.query },
            `${path}${image ? `#${image.id}` : ''}`,
            { shallow: true, scroll: false }
          );

    navigation.then(() => {
      if (!image) return;

      // Next scrolls to the element with the hash's id (the thumbnail) after
      // rendering, in a timeout, and the page should stay where it is. Moving
      // the thumbnail into view has to come after that, or it's undone.
      setTimeout(() => {
        window.scroll(0, scrollY);
        if (scrollToThumbnail) scrollThumbnailIntoView(image.id);
      });
    });
  };

  return [expandedImage, setExpandedImage];
};

export default useExpandedImage;
