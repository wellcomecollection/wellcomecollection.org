import { FunctionComponent, useEffect, useState, useCallback } from 'react';
import Gallery from 'react-photo-gallery';
import styled from 'styled-components';

import { Image, CatalogueResultsList } from '@weco/common/model/catalogue';

import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import Modal from '@weco/common/views/components/Modal/Modal';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';

type Props = {
  images: CatalogueResultsList<Image>;
};

type GalleryImageProps = Image & {
  src: string;
  width: number;
  height: number;
};

const imageMargin = 16;

const GalleryContainer = styled.div`
  margin: 0 -${imageMargin / 2}px;

  // This div is rendered by Gallery so we're targetting it on mobile only to ensure images are aligned on both sides
  .react-photo-gallery--gallery > div {
    justify-content: space-around;
  }

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    margin: 0 -${imageMargin}px;

    .react-photo-gallery--gallery > div {
      justify-content: flex-start;
    }
  }
`;
const ImageContainer = styled.li`
  margin: 0 ${imageMargin ? imageMargin / 2 : 0}px
    ${imageMargin ? imageMargin / 2 : 0}px;

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    margin: 0 ${imageMargin}px ${imageMargin}px;
  }
`;

const ImageEndpointSearchResults: FunctionComponent<Props> = ({
  images,
}: Props) => {
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  const [data, setData] = useState<GalleryImageProps[]>([]);

  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const expandedImagePosition = images.results.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (data.length) setData([]);

    images.results.map(async image => {
      setData(prev => {
        return [
          ...prev,
          {
            ...image,
            src: convertImageUri(image.locations[0].url, 300),
            width: (image.aspectRatio || 1) * 100 + imageMargin,
            height: 100,
          },
        ];
      });
    });
  }, [images]);

  const imageRenderer = useCallback(galleryImage => {
    return (
      <ImageContainer key={galleryImage.key} role="listitem">
        <ImageCard
          id={galleryImage.photo.id}
          workId={galleryImage.photo.workId}
          image={{
            contentUrl: galleryImage.photo.src,
            width: galleryImage.photo.width - imageMargin * 2,
            height: galleryImage.photo.height,
            alt: galleryImage.photo.source.title,
          }}
          onClick={event => {
            event.preventDefault();
            setExpandedImage(galleryImage.photo);
            setIsActive(true);
          }}
        />
      </ImageContainer>
    );
  }, []);

  return (
    <ul role="list" className="plain-list no-margin no-padding">
      <GalleryContainer>
        <Gallery
          photos={data}
          renderImage={imageRenderer}
          margin={0} // The default margin is 2, but it doesn't work with our setup, so setting it to 0 and styling it manually
          targetRowHeight={220}
        />
        <Modal
          id={'expanded-image-dialog'}
          isActive={isActive}
          setIsActive={setIsActive}
          width={'80vw'}
        >
          <ExpandedImage
            resultPosition={expandedImagePosition}
            image={expandedImage}
            setExpandedImage={setExpandedImage}
          />
        </Modal>
      </GalleryContainer>
    </ul>
  );
};

export default ImageEndpointSearchResults;
