import { FunctionComponent, useRef } from 'react';
import styled from 'styled-components';

import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import ImageCard from '@weco/content/components/ImageCard';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import ImageScrollButtons from './ImageScrollButtons';
import ExpandedImageModal from '../ImageEndpointSearchResults/ExpandedImageModal';
import useExpandedImage from '../ImageEndpointSearchResults/useExpandedImage';

const IMAGE_HEIGHT = 200;

const ImageCardList = styled(PlainList)`
  display: flex;
  overflow-x: hidden;
`;

type Props = {
  images: Image[];
};

const ImageSectionGallery: FunctionComponent<Props> = ({ images }: Props) => {
  const [expandedImage, setExpandedImage] = useExpandedImage(images);
  const scrollContainerRef = useRef<HTMLElement>(null);

  return (
    <>
      <ImageScrollButtons targetRef={scrollContainerRef}></ImageScrollButtons>
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
    </>
  );
};

export default ImageSectionGallery;
