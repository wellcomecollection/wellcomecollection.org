import {
  FunctionComponent,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';

import {
  useFeatureFlags,
  usePhasedFlags,
} from '@weco/common/server-data/Context';
import Space from '@weco/common/views/components/styled/Space';
import {
  containerEdge,
  containerPadding,
} from '@weco/common/views/themes/config';
import {
  CatalogueResultsList,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import { useExpandedImage } from '@weco/content/views/components/ImageModal';
import ImageSidebar, {
  SidebarStatus,
  StepHandler,
} from '@weco/content/views/components/ImageSidebar';
import { ImagesProps } from '@weco/content/views/components/SearchPagesLink/Images';
import { phaseIsAtLeast } from '@weco/toggles';

import useResultsPages from './images.useResultsPages';

const ResultsLayout = styled.div`
  display: flex;
  align-items: flex-start;
  overflow-x: clip;
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};
`;

// Keeps the pagination at the bottom of the results column, which is as tall as the sidebar
const PaginationArea = styled.div`
  margin-top: auto;
`;

const Results = styled.div<{
  $hasSidebar: boolean;
  $isCovered: boolean;
  $isFullWidth: boolean;
  /** The space next to the open sidebar matches the sidebar's own padding. */
  $hasSidebarMatchedGap: boolean;
}>`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;

  /* Lines the results up with the page's Container, which the sidebar isn't in
  because it runs to the right edge. Full width, they go out to its padding. */
  ${props => {
    const padding = props.$isFullWidth
      ? containerPadding
      : containerEdge(props.theme.sizes.lg);

    return css`
      padding-left: ${padding};
      padding-right: ${padding};
    `;
  }}

  ${props =>
    props.$hasSidebar &&
    css`
      align-self: stretch;

      ${props.theme.media('sm')(`
        padding-right: ${props.$hasSidebarMatchedGap ? props.theme.getSpaceValue('md', 'sm') : containerPadding};
      `)}

      ${
        props.$hasSidebarMatchedGap &&
        props.theme.media('md')(`
        padding-right: ${props.theme.getSpaceValue('md', 'md')};
      `)
      }
    `}

  /* Hidden rather than removed under the full screen sidebar, so they keep their place but leave the tab order */
  ${props =>
    props.$isCovered &&
    css`
      visibility: hidden;

      ${props.theme.media('sm')(`
        visibility: visible;
      `)}
    `}
`;

/**
 * Returns focus to the selected image's thumbnail when the sidebar closes. If
 * the selected image isn't in the results, it goes to the last one that was.
 */
const useReturnFocusOnClose = (
  images: Image[],
  expandedImage: Image | undefined,
  resultsRef: RefObject<HTMLElement | null>
) => {
  const isActive = expandedImage !== undefined;
  const lastImageId = useRef<string | undefined>(undefined);

  // Only images in the results have a thumbnail to go back to, so an image
  // chosen from the visually similar ones leaves the last thumbnail as it was
  useEffect(() => {
    if (expandedImage && images.some(({ id }) => id === expandedImage.id)) {
      lastImageId.current = expandedImage.id;
    }
  }, [expandedImage]);

  useEffect(() => {
    const imageId = lastImageId.current;
    const results = resultsRef.current;
    if (isActive || !imageId || !results) return;

    // Without scrolling, so the results stay where they were
    const focusThumbnail = () =>
      document.getElementById(imageId)?.focus({ preventScroll: true });
    focusThumbnail();

    // The results get their width back as the sidebar closes, and the gallery
    // lays out again. A thumbnail that moves to another row is remounted, which
    // drops its focus, so put it back once that's happened.
    const observer = new ResizeObserver(() =>
      requestAnimationFrame(() => {
        if (document.activeElement === document.body) focusThumbnail();
      })
    );
    observer.observe(results);
    const stopWatching = setTimeout(() => observer.disconnect(), 1000);

    return () => {
      observer.disconnect();
      clearTimeout(stopWatching);
    };
  }, [isActive]);
};

// Searches with at least this many results (so more than 8) spread into the
// page's margins. Based on the whole search, not the page, so every page of it
// is the same width.
const FULL_WIDTH_MIN_RESULTS = 9;

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

type Props = PropsWithChildren<{
  resultsList: CatalogueResultsList<Image>;
  imagesRouteProps: ImagesProps;
}>;

const ImagesResultsWithSidebar: FunctionComponent<Props> = ({
  resultsList,
  imagesRouteProps,
  children,
}) => {
  const { results: images, totalPages, pageSize } = resultsList;
  const [expandedImage, setExpandedImage] = useExpandedImage(images);
  const { imageSidebarPhases } = usePhasedFlags();
  const showImageSidebarPhase3 = phaseIsAtLeast(imageSidebarPhases, 'phase3');
  const { masonryImages: showMasonryImages = false } = useFeatureFlags();
  const isFullWidth =
    showMasonryImages && resultsList.totalResults >= FULL_WIDTH_MIN_RESULTS;

  const layoutRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isActive = expandedImage !== undefined;

  const [sidebarStatus, setSidebarStatus] = useState<SidebarStatus>('closed');

  useReturnFocusOnClose(images, expandedImage, resultsRef);

  // Choosing the image that's already open closes it
  const selectImage = (image: Image) =>
    setExpandedImage(image.id === expandedImage?.id ? undefined : image);

  // An image that isn't in the results (e.g. a visually similar one) has no
  // previous or next
  const expandedIndex = expandedImage
    ? images.findIndex(({ id }) => id === expandedImage.id)
    : -1;
  const isInResults = expandedIndex !== -1;

  // Each step is its own browser history entry, so the browser's Back goes back
  // through the images stepped through, as it does for ones picked from the
  // grid. The grid is behind the sidebar full screen, but still scrolled, so
  // closing it leaves the image you were on in view.
  const stepOptions = { scrollToThumbnail: true };
  const { page, query } = imagesRouteProps;

  const stepTo =
    (direction: -1 | 1, image: Image, positionInList: number): StepHandler =>
    beforeStep => {
      beforeStep();
      trackStep({ direction, image, positionInList, query });
      setExpandedImage(image, stepOptions);
    };

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

  const onPrevious = stepHandlerFor(-1);
  const onNext = stepHandlerFor(1);

  /**
   * Escape closes the sidebar when focus is in the results or nowhere in
   * particular (e.g. after clicking a thumbnail). Escape pressed inside a
   * filters modal or dropdown is left to them.
   */
  useEffect(() => {
    if (!isActive) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;

      const target = event.target as Node;
      if (target === document.body || layoutRef.current?.contains(target)) {
        setExpandedImage(undefined);
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [isActive]);

  return (
    <ResultsLayout ref={layoutRef}>
      <Results
        ref={resultsRef}
        $hasSidebar={sidebarStatus !== 'closed'}
        $isCovered={isActive && sidebarStatus === 'open'}
        $isFullWidth={isFullWidth}
        $hasSidebarMatchedGap={showMasonryImages}
      >
        <Space $v={{ size: 'md', properties: ['padding-top'] }}>
          <main>
            {showMasonryImages ? (
              <CatalogueImageGallery
                images={images}
                variant="masonry"
                onImageSelect={selectImage}
                selectedImageId={expandedImage?.id}
              />
            ) : (
              <CatalogueImageGallery
                images={images}
                variant="justified"
                imageDetails="sidebar"
                onImageSelect={selectImage}
                selectedImageId={expandedImage?.id}
              />
            )}
          </main>
        </Space>
        <PaginationArea>{children}</PaginationArea>
      </Results>

      <ImageSidebar
        images={images}
        expandedImage={expandedImage}
        setExpandedImage={setExpandedImage}
        onStatusChange={setSidebarStatus}
        onPrevious={onPrevious}
        onNext={onNext}
        arrowKeysAreaRef={layoutRef}
      />
    </ResultsLayout>
  );
};

export default ImagesResultsWithSidebar;
