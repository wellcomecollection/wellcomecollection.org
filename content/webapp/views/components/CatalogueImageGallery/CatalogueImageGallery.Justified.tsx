import { FunctionComponent, useMemo } from 'react';
import PhotoAlbum, {
  RenderPhotoProps,
  RenderRowContainer,
} from 'react-photo-album';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { hexToRgb } from '@weco/content/utils/convert-colors';
import ImageModal, {
  useExpandedImage,
} from '@weco/content/views/components/ImageModal';

import ImageCard from './CatalogueImageGallery.ImageCard';

type BaseProps = {
  images: Image[];
  background?: string;
  targetRowHeight?: number;
};

/**
 * Where an image's details are shown when it's clicked. The gallery handles
 * the modal itself; for the sidebar the parent owns the selected image, so it
 * is told which image was selected.
 */
export type Props = BaseProps &
  (
    | { imageDetails?: 'modal' }
    | { imageDetails: 'sidebar'; onImageSelect: (image: Image) => void }
  );

type GalleryImageProps = Image & {
  src: string;
  width: number;
  height: number;
  averageColor?: string;
};

const imageMargin = 16;

const GalleryContainer = styled.div`
  margin: 0 -${imageMargin / 2}px;

  /* This div is rendered by Gallery so we're targeting it on mobile only to ensure images are aligned on both sides */

  .react-photo-gallery--gallery > div {
    justify-content: space-around;
  }

  ${props =>
    props.theme.media('sm')(`
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

const AlbumRow = styled(PlainList)`
  display: flex;
  margin-bottom: 0;
`;

const ImageFrame = styled.div`
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
`;

type GridProps = BaseProps & {
  onImageSelect: (image: Image) => void;
};

const ImageGrid: FunctionComponent<GridProps> = ({
  images,
  background,
  targetRowHeight,
  onImageSelect,
}: GridProps) => {
  const { isFullSupportBrowser } = useAppContext();

  // If there's only two images or less, display them differently (not worth loading the gallery + they display too large)
  const isSmallGallery = images.length < 3;

  // Loop through images to add data that Gallery needs in order to render
  const imagesWithDimensions: GalleryImageProps[] = useMemo(
    () =>
      images.map(image => ({
        ...image,
        src: image.locations[0].url,
        width: (image.aspectRatio || 1) * 100,
        height: 100,
      })),
    [images]
  );

  const renderRowContainer: RenderRowContainer = ({ children }) => {
    return <AlbumRow>{children}</AlbumRow>;
  };

  const imageRenderer = ({
    // these are values and props that are passed in by the PhotoAlbum component
    photo,
    layout,
  }: RenderPhotoProps<GalleryImageProps>) => {
    const rgbColor = hexToRgb(photo.averageColor || '');
    return (
      <li style={{ padding: 12 }}>
        <ImageFrame>
          <ImageCard
            id={photo.id}
            workId={photo.source.id}
            positionInList={layout.index + 1}
            image={{
              contentUrl: photo.src,
              width: layout.width,
              height: layout.height,
              alt: photo.source.title,
            }}
            onClick={event => {
              event.preventDefault();
              onImageSelect(photo);
            }}
            layout="fixed"
            background={
              background ||
              (rgbColor &&
                `rgb(${rgbColor.r}, ${rgbColor.g}, ${rgbColor.b}, 0.5)`)
            }
          />
        </ImageFrame>
      </li>
    );
  };
  return (
    <>
      {isFullSupportBrowser && !isSmallGallery && (
        <GalleryContainer data-testid="image-search-results-container">
          <PhotoAlbum
            photos={imagesWithDimensions}
            renderPhoto={imageRenderer}
            renderRowContainer={renderRowContainer}
            layout="rows"
            spacing={0}
            padding={12}
            targetRowHeight={targetRowHeight || 200}
          />
        </GalleryContainer>
      )}

      {(!isFullSupportBrowser || isSmallGallery) && (
        <div data-testid="image-search-results-container">
          <ImageCardList>
            {imagesWithDimensions.map((result: GalleryImageProps, index) => (
              <li key={result.id}>
                <Space
                  $h={{ size: 'md', properties: ['margin-right'] }}
                  $v={{ size: 'md', properties: ['margin-bottom'] }}
                >
                  <ImageCard
                    id={result.id}
                    workId={result.source.id}
                    positionInList={index + 1}
                    image={{
                      contentUrl: result.src,
                      width: result.width * 1.57,
                      height: result.height * 1.57,
                      alt: result.source.title,
                    }}
                    onClick={event => {
                      if (isSmallGallery) {
                        event.preventDefault();
                        onImageSelect(result);
                      }
                    }}
                    layout="fixed"
                  />
                </Space>
              </li>
            ))}
          </ImageCardList>
        </div>
      )}
    </>
  );
};

const ImageGridWithModal: FunctionComponent<BaseProps> = props => {
  const [expandedImage, setExpandedImage] = useExpandedImage(props.images);

  return (
    <>
      <ImageGrid {...props} onImageSelect={setExpandedImage} />
      <ImageModal
        images={props.images}
        expandedImage={expandedImage}
        setExpandedImage={setExpandedImage}
      />
    </>
  );
};

const CatalogueImageGalleryJustified: FunctionComponent<Props> = props =>
  props.imageDetails === 'sidebar' ? (
    <ImageGrid {...props} onImageSelect={props.onImageSelect} />
  ) : (
    <ImageGridWithModal {...props} />
  );

export default CatalogueImageGalleryJustified;
