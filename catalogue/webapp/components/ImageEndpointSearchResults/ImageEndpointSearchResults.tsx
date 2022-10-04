import {
  FunctionComponent,
  useMemo,
  useState,
  useCallback,
  useContext,
} from 'react';
import Gallery from 'react-photo-gallery';
import styled from 'styled-components';

import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { hexToRgb } from '@weco/common/utils/convert-colors';
import { Image, CatalogueResultsList } from '@weco/common/model/catalogue';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import Modal from '@weco/common/views/components/Modal/Modal';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  images: CatalogueResultsList<Image>;
  background?: string;
};

type GalleryImageProps = Image & {
  src: string;
  width: number;
  height: number;
  averageColor?: string;
};

const imageMargin = 16;

const GalleryContainer = styled.div`
  margin: 0 -${imageMargin / 2}px;

  // This div is rendered by Gallery so we're targetting it on mobile only to ensure images are aligned on both sides
  .react-photo-gallery--gallery > div {
    justify-content: space-around;
  }

  ${props =>
    props.theme.media('medium')(`
    margin: 0 -${imageMargin}px;

    .react-photo-gallery--gallery > div {
      justify-content: flex-start;
    }
  `)}
`;
const ImageContainer = styled.li`
  margin: 0 ${imageMargin ? imageMargin / 2 : 0}px
    ${imageMargin ? imageMargin / 2 : 0}px;

  ${props =>
    props.theme.media('medium')(`
    margin: 0 ${imageMargin}px ${imageMargin}px;
  `)}
`;

const ImageEndpointSearchResults: FunctionComponent<Props> = ({
  images,
  background,
}: Props) => {
  const { isFullSupportBrowser } = useContext(AppContext);
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  const [isActive, setIsActive] = useState(false);

  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const expandedImagePosition = images.results.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );

  // If there's only two images or less, display them differently (not worth loading the gallery + they display too large)
  const isSmallGallery = images.results.length < 3;

  // Loop through images to add data that Gallery needs in order to render
  const imagesWithDimensions: GalleryImageProps[] = useMemo(
    () =>
      images.results.map(image => ({
        ...image,
        src: convertImageUri(image.locations[0].url, 300),
        width: (image.aspectRatio || 1) * 100 + imageMargin,
        height: 100,
      })),
    [images.results]
  );

  const imageRenderer = useCallback(galleryImage => {
    const photo: GalleryImageProps = galleryImage.photo;
    const rgbColor = hexToRgb(photo.averageColor || '');

    return (
      <ImageContainer key={galleryImage.key} role="listitem">
        <ImageCard
          id={photo.id}
          workId={photo.source.id}
          image={{
            contentUrl: photo.src,
            width: photo.width - imageMargin * 2,
            height: photo.height,
            alt: photo.source.title,
          }}
          onClick={event => {
            event.preventDefault();
            setExpandedImage(photo);
            setIsActive(true);
          }}
          layout="fixed"
          background={
            background ||
            (rgbColor &&
              `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.2)`)
          }
        />
      </ImageContainer>
    );
  }, []);

  return (
    <>
      {isFullSupportBrowser && !isSmallGallery && (
        <ul role="list" className="plain-list no-margin no-padding">
          <GalleryContainer>
            <Gallery
              photos={imagesWithDimensions}
              renderImage={imageRenderer}
              margin={0} // The default margin is 2, but it doesn't work with our setup, so setting it to 0 and styling it manually
              targetRowHeight={220}
            />
          </GalleryContainer>
        </ul>
      )}

      {(!isFullSupportBrowser || isSmallGallery) && (
        <ul
          className="flex flex--wrap plain-list no-padding no-margin"
          role="list"
        >
          {imagesWithDimensions.map((result: GalleryImageProps) => (
            <li key={result.id} role="listitem">
              <Space
                h={{ size: 'l', properties: ['margin-right'] }}
                v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                <ImageCard
                  id={result.id}
                  workId={result.source.id}
                  image={{
                    contentUrl: result.src,
                    width: 156,
                    height: 156,
                    alt: result.source.title,
                  }}
                  onClick={event => {
                    if (isSmallGallery) {
                      event.preventDefault();
                      setExpandedImage(result);
                      setIsActive(true);
                    }
                  }}
                  layout="fill"
                />
              </Space>
            </li>
          ))}
        </ul>
      )}

      <Modal
        id="expanded-image-dialog"
        isActive={isActive}
        setIsActive={setIsActive}
        width="80vw"
      >
        <ExpandedImage
          resultPosition={expandedImagePosition}
          image={expandedImage}
          setExpandedImage={setExpandedImage}
        />
      </Modal>
    </>
  );
};

export default ImageEndpointSearchResults;
