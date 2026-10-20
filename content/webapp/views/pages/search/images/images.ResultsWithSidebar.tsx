import { FunctionComponent, PropsWithChildren, useEffect, useRef } from 'react';
import styled from 'styled-components';

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

const Results = styled.div`
  flex: 1 1 0;
  min-width: 0;
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
      document.getElementById(lastImageId.current)?.focus();
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
      <Results>
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
