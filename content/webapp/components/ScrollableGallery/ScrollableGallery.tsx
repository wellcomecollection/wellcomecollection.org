import { FunctionComponent, useRef } from 'react';
import styled from 'styled-components';

import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import ImageCard from '@weco/content/components/ImageCard';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import ExpandedImageModal from '../ImageEndpointSearchResults/ExpandedImageModal';
import useExpandedImage from '../ImageEndpointSearchResults/useExpandedImage';
import { font } from '@weco/common/utils/classnames';
import ScrollableGalleryButtons from './ScrollableGalleryButtons';

const IMAGE_HEIGHT = 200;

const ImageCardList = styled(PlainList)`
  display: flex;
  overflow: hidden;
  position: relative;
`;

const GalleryContainer = styled(Space).attrs({
  $v: { size: 's', properties: ['padding-top'] }
})`
  background-color: ${props => props.theme.color('neutral.700')};
`;

const ScrollButtonsContainer = styled(Space).attrs({
  as: 'h3',
  className: font('intsb', 2),
  $v: { size: 'm', properties: ['margin-bottom'] },
})`
  display: flex;
  justify-content: space-between;
`;

const Label = styled(Space).attrs({
  className: font('intr', 6),
})`
  color: ${props => props.theme.color('neutral.400')};
`;

type Props = {
  images: Image[];
  label?: string;
};

const ScrollableGallery: FunctionComponent<Props> = ({
  images,
  label,
}: Props) => {
  const [expandedImage, setExpandedImage] = useExpandedImage(images);
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  return (
    <GalleryContainer>
      <ScrollButtonsContainer>
        {label && <Label>{label}</Label>}
        <ScrollableGalleryButtons
          targetRef={scrollContainerRef}
        ></ScrollableGalleryButtons>
      </ScrollButtonsContainer>
      <div data-testid="image-search-results-container">
        <ImageCardList ref={scrollContainerRef}>
          {images.map((image, index) => (
            <li key={image.id}>
              <Space $h={{ size: 'm', properties: ['margin-right'] }}>
                <ImageCard
                  id={image.id}
                  workId={image.source.id}
                  positionInList={index + 1}
                  image={{
                    contentUrl: image.locations[0].url,
                    width: IMAGE_HEIGHT * (image.aspectRatio || 1),
                    height: IMAGE_HEIGHT,
                    alt: image.source.title,
                  }}
                  onClick={event => {
                    event.preventDefault();
                    setExpandedImage(image);
                  }}
                  layout="fixed"
                />
              </Space>
            </li>
          ))}
        </ImageCardList>
      </div>
      <ExpandedImageModal
        images={images}
        expandedImage={expandedImage}
        setExpandedImage={setExpandedImage}
      />
    </GalleryContainer>
  );
};

export default ScrollableGallery;
