import {
  FunctionComponent,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
} from 'react';
import styled, { css } from 'styled-components';

import Space from '@weco/common/views/components/styled/Space';
import { containerPadding } from '@weco/common/views/themes/config';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import { useExpandedImage } from '@weco/content/views/components/ImageModal';
import ImageSidebar from '@weco/content/views/components/ImageSidebar';

const ResultsLayout = styled.div`
  display: flex;
  align-items: flex-start;
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};
`;

// Where the content of a Container starts: half of the space left either side
// of its max width, plus its own padding
const containerEdge = (maxWidth: string) =>
  `calc(max(0px, (100% - ${maxWidth}) / 2) + min(100%, ${maxWidth}) * ${parseFloat(containerPadding) / 100})`;

// Hidden, not removed, when the sidebar covers the screen (below `sm`): that
// takes the results out of the tab order and away from screen readers, while
// keeping their place on the page.
// Keeps the pagination at the bottom of the results column, which is as tall as the sidebar
const PaginationArea = styled.div`
  margin-top: auto;
`;

const Results = styled.div<{ $isSidebarOpen: boolean }>`
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;

  /* Lines the results up with the page's Container, which the sidebar isn't in because it runs to the right edge */
  padding-left: ${props => containerEdge(props.theme.sizes.lg)};
  padding-right: ${props =>
    props.$isSidebarOpen ? 0 : containerEdge(props.theme.sizes.lg)};

  ${props =>
    props.$isSidebarOpen &&
    css`
      align-self: stretch;
      visibility: hidden;

      ${props.theme.media('sm')(`
        visibility: visible;
        padding-right: ${containerPadding};
      `)}
    `}
`;

/**
 * Returns focus to the selected image's thumbnail when the sidebar closes.
 * There's none to return to if the image isn't in the results.
 */
const useReturnFocusOnClose = (
  expandedImage: Image | undefined,
  resultsRef: RefObject<HTMLElement | null>
) => {
  const isActive = expandedImage !== undefined;
  const lastImageId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (expandedImage) lastImageId.current = expandedImage.id;
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

type Props = PropsWithChildren<{ images: Image[] }>;

const ImagesResultsWithSidebar: FunctionComponent<Props> = ({
  images,
  children,
}) => {
  const [expandedImage, setExpandedImage] = useExpandedImage(images, {
    keepOpenOnResultsChange: true,
  });

  const layoutRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isActive = expandedImage !== undefined;

  useReturnFocusOnClose(expandedImage, resultsRef);

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
      <Results ref={resultsRef} $isSidebarOpen={isActive}>
        <Space $v={{ size: 'md', properties: ['padding-top'] }}>
          <main>
            <CatalogueImageGallery
              images={images}
              variant="justified"
              imageDetails="sidebar"
              onImageSelect={setExpandedImage}
            />
          </main>
        </Space>
        <PaginationArea>{children}</PaginationArea>
      </Results>

      <ImageSidebar
        images={images}
        expandedImage={expandedImage}
        setExpandedImage={setExpandedImage}
      />
    </ResultsLayout>
  );
};

export default ImagesResultsWithSidebar;
