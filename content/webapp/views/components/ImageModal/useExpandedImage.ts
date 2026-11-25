import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

import { useFeatureFlags, useModes } from '@weco/common/server-data/Context';
import useUrlHash from '@weco/content/hooks/useUrlHash';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

type SetExpandedImageOptions = {
  // Rather than keeping the page where it is
  scrollToThumbnail?: boolean;
  // Image search only: assumes the param is `page` and that page 1 is left
  // out of the URL
  page?: number;
};

export type SetExpandedImage = (
  image: Image | undefined,
  options?: SetExpandedImageOptions
) => void;

// Instant rather than smooth: in Chrome, the re-render after the URL changes
// can stop a smooth scroll partway, leaving the thumbnail off screen
const scrollThumbnailIntoView = (imageId: string) =>
  document.getElementById(imageId)?.scrollIntoView({ block: 'nearest' });

/**
 * The image open in the modal or sidebar. The URL's hash is the only record of
 * which one it is, so the browser's Back and Forward, links with an image's id
 * in them, and every instance of this hook on a page agree. Setting it goes
 * through Next.js's router, which keeps the history right.
 */
const useExpandedImage = (
  images: Image[]
): [Image | undefined, SetExpandedImage, boolean] => {
  const router = useRouter();
  const imageId = useUrlHash(router.asPath);

  // Whether the URL last went from one image to another by itself (e.g. the
  // browser's Back), rather than through `setExpandedImage`. Requests made
  // faster than the URL changes wait here in order, as objects so a cancelled
  // one can be dropped without a later one for the same image.
  const requests = useRef<{ id: string | undefined }[]>([]);
  const [lastImageId, setLastImageId] = useState(imageId);
  const [isFromUrlChange, setIsFromUrlChange] = useState(false);
  if (imageId !== lastImageId) {
    setLastImageId(imageId);
    setIsFromUrlChange(
      lastImageId !== undefined &&
        imageId !== undefined &&
        !requests.current.some(({ id }) => id === imageId)
    );
  }

  // Done with once the URL reaches it, along with anything requested before
  // (including the same id twice, from a double click)
  useEffect(() => {
    let last = -1;
    requests.current.forEach(({ id }, index) => {
      if (id === imageId) last = index;
    });
    requests.current.splice(0, last + 1);
  }, [imageId]);
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
    { scrollToThumbnail = false, page } = {}
  ) => {
    const { router, imageId } = latest.current;

    // Already open: pushing the same URL again would add a history entry
    if (image?.id === imageId) return;

    // Keeps an image we already have (e.g. a visually similar one) open while
    // the URL changes, rather than fetching it again
    if (image) seenImages.current[image.id] = image;
    const request = { id: image?.id };
    requests.current.push(request);
    // A navigation that's cancelled (resolves false) or fails never reaches
    // the URL, so a later visit to that image comes from the browser
    const forget = () => {
      requests.current = requests.current.filter(r => r !== request);
    };

    const [path] = router.asPath.split('#');
    const { scrollY } = window;
    const navigate = router.push.bind(router);

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

    navigation.then(isDone => {
      if (!isDone) forget();
    }, forget);

    navigation.then(() => {
      if (!image) return;

      // Next.js scrolls to the element with the hash's id (the thumbnail) after
      // rendering, in a timeout, and the page should stay where it is. Moving
      // the thumbnail into view has to come after that, or it's undone.
      setTimeout(() => {
        window.scroll(0, scrollY);
        if (scrollToThumbnail) scrollThumbnailIntoView(image.id);
      });
    });
  };

  return [expandedImage, setExpandedImage, isFromUrlChange];
};

export default useExpandedImage;
