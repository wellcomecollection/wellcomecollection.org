import { FunctionComponent, useMemo, useState, useContext } from 'react';
import PhotoAlbum, {
  RenderPhotoProps,
  RenderRowContainer,
} from 'react-photo-album';
import styled from 'styled-components';

import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { hexToRgb } from '@weco/common/utils/convert-colors';
import { Image } from '@weco/common/model/catalogue';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import Modal from '@weco/common/views/components/Modal/Modal';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  images: Image[];
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

const ImageCardList = styled(PlainList)`
  display: flex;
  flex-wrap: wrap;
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
  const expandedImagePosition = images.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );

  // If there's only two images or less, display them differently (not worth loading the gallery + they display too large)
  const isSmallGallery = images.length < 3;

  // Loop through images to add data that Gallery needs in order to render
  const imagesWithDimensions: GalleryImageProps[] = useMemo(
    () =>
      images.map(image => ({
        ...image,
        src: convertImageUri(image.locations[0].url, 300),
        width: (image.aspectRatio || 1) * 100,
        height: 100,
      })),
    [images]
  );

  const AlbumRow = styled(PlainList)`
    display: flex;
    align-items: space-between;
    margin-bottom: 0;
  `;

  const renderRowContainer: RenderRowContainer = ({ children }) => {
    return <AlbumRow>{children}</AlbumRow>;
  };

  const ImageFrame = styled.div`
    display: block;
    position: relative;
    width: 100%;
    height: 100%;
  `;

  const imageRenderer: FunctionComponent<RenderPhotoProps<GalleryImageProps>> =
    // these are values and props that are passed in by the PhotoAlbum component
    ({ photo, layout }) => {
      const rgbColor = hexToRgb(photo.averageColor || '');
      return (
        <li style={{ padding: 12 }}>
          <ImageFrame>
            <ImageCard
              id={photo.id}
              workId={photo.source.id}
              image={{
                contentUrl: photo.src,
                width: layout.width,
                height: layout.height,
                alt: photo.source.title,
              }}
              onClick={event => {
                event.preventDefault();
                setExpandedImage(photo);
                setIsActive(true);
              }}
              layout="true-raw"
              background={
                background ||
                (rgbColor &&
                  `rgba(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.5)`)
              }
            />
          </ImageFrame>
        </li>
      );
    };
  return (
    <>
      {isFullSupportBrowser && !isSmallGallery && (
        <PlainList role="list">
          <GalleryContainer>
            <PhotoAlbum
              photos={imagesWithDimensions}
              renderPhoto={imageRenderer}
              renderRowContainer={renderRowContainer}
              layout="rows"
              spacing={0}
              padding={12}
              targetRowHeight={200}
            />
          </GalleryContainer>
        </PlainList>
      )}

      {(!isFullSupportBrowser || isSmallGallery) && (
        <ImageCardList role="list">
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
                  layout="true-raw"
                />
              </Space>
            </li>
          ))}
        </ImageCardList>
      )}

      <Modal
        id="expanded-image-dialog"
        isActive={isActive}
        setIsActive={setIsActive}
        maxWidth="1020px"
      >
        <ExpandedImage
          resultPosition={expandedImagePosition}
          image={expandedImage}
          isActive={isActive}
          setExpandedImage={setExpandedImage}
        />
      </Modal>
    </>
  );
};

export default ImageEndpointSearchResults;
