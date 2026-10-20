import { FunctionComponent, PropsWithChildren, useEffect, useRef } from 'react';
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

type Props = PropsWithChildren<{ images: Image[] }>;

const ImagesResultsWithSidebar: FunctionComponent<Props> = ({
  images,
  children,
}) => {
  const [expandedImage, setExpandedImage] = useExpandedImage(images);

  const layoutRef = useRef<HTMLDivElement>(null);
  const isActive = expandedImage !== undefined;

  const lastImageId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (expandedImage) lastImageId.current = expandedImage.id;
  }, [expandedImage]);

  // Focus goes back to the selected image's thumbnail when the sidebar closes.
  // There's none to return to if the image isn't in the results.
  useEffect(() => {
    if (!isActive && lastImageId.current) {
      // Without scrolling, so the results stay where they were
      document
        .getElementById(lastImageId.current)
        ?.focus({ preventScroll: true });
    }
  }, [isActive]);

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
      <Results $isSidebarOpen={isActive}>
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
