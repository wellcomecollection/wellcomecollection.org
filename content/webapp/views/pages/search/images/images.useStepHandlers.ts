import { useEffect, useRef } from 'react';

import { usePhasedFlags } from '@weco/common/server-data/Context';
import {
  CatalogueResultsList,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { SetExpandedImage } from '@weco/content/views/components/ImageModal/useExpandedImage';
import { StepHandler } from '@weco/content/views/components/ImageSidebar';
import { ImagesProps } from '@weco/content/views/components/SearchPagesLink/Images';
import { phaseIsAtLeast } from '@weco/toggles';

import useResultsPages from './images.useResultsPages';

// How close to either end of a page of results the next or previous page is
// fetched, so stepping onto it doesn't have to wait
const FETCH_NEIGHBOURING_PAGE_WITHIN = 3;

// The position is within its page of results, like the thumbnails'
// `data-gtm-position-in-list`
const trackStep = ({
  direction,
  image,
  positionInList,
  query,
}: {
  direction: -1 | 1;
  image: Image;
  positionInList: number;
  query: string;
}) => {
  window.dataLayer?.push({
    event: direction === 1 ? 'sidebar_next_image' : 'sidebar_previous_image',
    work_id: image.source.id,
    image_id: image.id,
    query,
    position_in_list: positionInList,
  });
};

/**
 * The sidebar's Previous and Next handlers, which step through the results and
 * on into the page of results either side of them. A direction with nowhere to
 * go gets no handler, which is what disables its button: either end of the
 * results, or an image that isn't in them at all (e.g. a visually similar one).
 */
const useStepHandlers = ({
  resultsList,
  imagesRouteProps,
  expandedImage,
  setExpandedImage,
}: {
  resultsList: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
  expandedImage: Image | undefined;
  setExpandedImage: SetExpandedImage;
}): { onPrevious?: StepHandler; onNext?: StepHandler } => {
  const { results: images, totalPages, pageSize } = resultsList;
  const { page, query } = imagesRouteProps;
  const { imageSidebarPhases } = usePhasedFlags();
  const showImageSidebarPhase3 = phaseIsAtLeast(imageSidebarPhases, 'phase3');

  // An image that isn't in the results (e.g. a visually similar one) has no
  // previous or next
  const expandedIndex = expandedImage
    ? images.findIndex(({ id }) => id === expandedImage.id)
    : -1;
  const isInResults = expandedIndex !== -1;

  const { fetchPage, hasFailed } = useResultsPages(imagesRouteProps, pageSize);
  const hasNextPage = page < totalPages && !hasFailed(page + 1);
  const hasPreviousPage = page > 1 && !hasFailed(page - 1);

  useEffect(() => {
    if (!showImageSidebarPhase3 || !isInResults) return;

    if (
      hasNextPage &&
      expandedIndex >= images.length - FETCH_NEIGHBOURING_PAGE_WITHIN
    ) {
      fetchPage(page + 1);
    }
    if (hasPreviousPage && expandedIndex < FETCH_NEIGHBOURING_PAGE_WITHIN) {
      fetchPage(page - 1);
    }
  }, [expandedImage?.id, images, showImageSidebarPhase3]);

  // Stops a second click going to another page of results while the first is
  // loading, and drops a step that's still loading if something else is chosen
  const isChangingPage = useRef(false);
  const selection = useRef(0);
  useEffect(() => {
    isChangingPage.current = false;
    return () => {
      selection.current += 1;
    };
  }, [expandedImage?.id, images]);

  // Each step is its own browser history entry, so the browser's Back goes back
  // through the images stepped through, as it does for ones picked from the
  // grid. The grid is behind the sidebar full screen, but still scrolled, so
  // closing it leaves the image you were on in view.
  const stepOptions = { scrollToThumbnail: true };

  const stepTo =
    (direction: -1 | 1, image: Image, positionInList: number): StepHandler =>
    beforeStep => {
      beforeStep();
      trackStep({ direction, image, positionInList, query });
      setExpandedImage(image, stepOptions);
    };

  const stepToPage =
    (direction: -1 | 1): StepHandler =>
    async beforeStep => {
      if (isChangingPage.current) return;
      isChangingPage.current = true;
      const steppingFrom = selection.current;
      const toPage = page + direction;

      const results = await fetchPage(toPage);
      if (selection.current !== steppingFrom) return;

      const index = direction === 1 ? 0 : (results?.length ?? 0) - 1;
      const image = results?.[index];
      if (image) {
        beforeStep();
        trackStep({ direction, image, positionInList: index + 1, query });
        setExpandedImage(image, { ...stepOptions, page: toPage });
      } else {
        isChangingPage.current = false;
      }
    };

  const stepHandlerFor = (direction: -1 | 1): StepHandler | undefined => {
    if (!isInResults) return undefined;

    const neighbourIndex = expandedIndex + direction;
    const neighbour = images[neighbourIndex];
    if (neighbour) return stepTo(direction, neighbour, neighbourIndex + 1);

    if (!(direction === 1 ? hasNextPage : hasPreviousPage)) return undefined;

    return stepToPage(direction);
  };

  return { onPrevious: stepHandlerFor(-1), onNext: stepHandlerFor(1) };
};

export default useStepHandlers;
