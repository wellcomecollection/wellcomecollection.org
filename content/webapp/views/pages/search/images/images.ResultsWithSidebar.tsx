import {
  FunctionComponent,
  PropsWithChildren,
  RefObject,
  useEffect,
  useRef,
} from 'react';
import styled, { css } from 'styled-components';

import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import CatalogueImageGallery from '@weco/content/views/components/CatalogueImageGallery';
import { useExpandedImage } from '@weco/content/views/components/ImageModal';
import ImageSidebar from '@weco/content/views/components/ImageSidebar';

const ResultsLayout = styled.div`
  display: flex;
  align-items: flex-start;
  border-top: 1px solid ${props => props.theme.color('neutral.300')};
`;

// Hidden, not removed, when the sidebar covers the screen (below `sm`): that
// takes the results out of the tab order and away from screen readers, while
// keeping their place on the page.
const Results = styled.div<{ $isSidebarOpen: boolean }>`
  flex: 1 1 0;
  min-width: 0;

  ${props =>
    props.$isSidebarOpen &&
    css`
      visibility: hidden;

      ${props.theme.media('sm')(`visibility: visible;`)}
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

type Props = PropsWithChildren<{ images: Image[] }>;

const ImagesResultsWithSidebar: FunctionComponent<Props> = ({
  images,
  children,
}) => {
  const [expandedImage, setExpandedImage] = useExpandedImage(images);

  const layoutRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const isActive = expandedImage !== undefined;

  useReturnFocusOnClose(images, expandedImage, resultsRef);

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
          <Container>
            <main>
              <CatalogueImageGallery
                images={images}
                variant="justified"
                imageDetails="sidebar"
                onImageSelect={setExpandedImage}
              />
            </main>
            {children}
          </Container>
        </Space>
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
