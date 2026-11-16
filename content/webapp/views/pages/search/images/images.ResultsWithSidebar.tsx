import {
  FunctionComponent,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';

import { usePhasedFlags } from '@weco/common/server-data/Context';
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
  useIsSidebarFullScreen,
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
}>`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;

  /* Lines the results up with the page's Container, which the sidebar isn't in because it runs to the right edge */
  padding-left: ${props => containerEdge(props.theme.sizes.lg)};
  padding-right: ${props => containerEdge(props.theme.sizes.lg)};

  ${props =>
    props.$hasSidebar &&
    css`
      align-self: stretch;

      ${props.theme.media('sm')(`
        padding-right: ${containerPadding};
      `)}
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

// How close to either end of a page of results the next or previous page is
// fetched, so stepping onto it doesn't have to wait
const FETCH_NEIGHBOURING_PAGE_WITHIN = 3;

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
  const isFullScreen = useIsSidebarFullScreen();
  const { imageSidebarPhases } = usePhasedFlags();
  const showImageSidebarPhase3 = phaseIsAtLeast(imageSidebarPhases, 'phase3');
  const hasStepButtons = showImageSidebarPhase3 && !isFullScreen;

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
  const stepOptions = {
    replace: true,
    // Full screen, the results are hidden behind the sidebar
    scrollToThumbnail: !isFullScreen,
  };
  const stepTo =
    (image: Image): StepHandler =>
    beforeStep => {
      beforeStep();
      setExpandedImage(image, stepOptions);
    };

  const { page } = imagesRouteProps;
  const { fetchPage, hasFailed } = useResultsPages(imagesRouteProps, pageSize);
  const hasNextPage = page < totalPages && !hasFailed(page + 1);
  const hasPreviousPage = page > 1 && !hasFailed(page - 1);

  useEffect(() => {
    if (!hasStepButtons || !isInResults) return;

    if (
      hasNextPage &&
      expandedIndex >= images.length - FETCH_NEIGHBOURING_PAGE_WITHIN
    ) {
      fetchPage(page + 1);
    }
    if (hasPreviousPage && expandedIndex < FETCH_NEIGHBOURING_PAGE_WITHIN) {
      fetchPage(page - 1);
    }
  }, [expandedImage?.id, images, hasStepButtons]);

  // Stops a second click going to another page while the first is loading,
  // and drops a step that's still loading if something else is chosen
  const isChangingPage = useRef(false);
  const selection = useRef(0);
  useEffect(() => {
    isChangingPage.current = false;
    return () => {
      selection.current += 1;
    };
  }, [expandedImage?.id, images]);

  const stepToPage =
    (
      toPage: number,
      pick: (results: Image[]) => Image | undefined
    ): StepHandler =>
    async beforeStep => {
      if (isChangingPage.current) return;
      isChangingPage.current = true;
      const steppingFrom = selection.current;

      const results = await fetchPage(toPage);
      if (selection.current !== steppingFrom) return;

      const image = results && pick(results);
      if (image) {
        beforeStep();
        setExpandedImage(image, { ...stepOptions, page: toPage });
      } else {
        isChangingPage.current = false;
      }
    };

  const stepHandlerFor = (direction: -1 | 1): StepHandler | undefined => {
    if (!isInResults) return undefined;

    const neighbour = images[expandedIndex + direction];
    if (neighbour) return stepTo(neighbour);

    if (!(direction === 1 ? hasNextPage : hasPreviousPage)) return undefined;

    return stepToPage(page + direction, results =>
      direction === 1 ? results[0] : results[results.length - 1]
    );
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
      >
        <Space $v={{ size: 'md', properties: ['padding-top'] }}>
          <main>
            <CatalogueImageGallery
              images={images}
              variant="justified"
              imageDetails="sidebar"
              onImageSelect={selectImage}
              selectedImageId={expandedImage?.id}
            />
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
      />
    </ResultsLayout>
  );
};

export default ImagesResultsWithSidebar;
