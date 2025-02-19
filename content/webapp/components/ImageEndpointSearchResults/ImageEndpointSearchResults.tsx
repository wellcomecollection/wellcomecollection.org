import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PhotoAlbum, {
  RenderPhotoProps,
  RenderRowContainer,
} from 'react-photo-album';
import styled from 'styled-components';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import Modal from '@weco/common/views/components/Modal/Modal';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import ExpandedImage from '@weco/content/components/ExpandedImage/ExpandedImage';
import ImageCard from '@weco/content/components/ImageCard/ImageCard';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { hexToRgb } from '@weco/content/utils/convert-colors';

type Props = {
  images: Image[];
  background?: string;
  targetRowHeight?: number;
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

  /* This div is rendered by Gallery so we're targetting it on mobile only to ensure images are aligned on both sides */
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

const ImageEndpointSearchResults: FunctionComponent<Props> = ({
  images,
  background,
  targetRowHeight,
}: Props) => {
  const { isFullSupportBrowser } = useContext(AppContext);
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  const [isActive, setIsActive] = useState(false);
  const { toggles } = useContext(ServerDataContext);

  const imageMap = useMemo<Record<string, Image>>(
    () => images.reduce((a, image) => ({ ...a, [image.id]: image }), {}),
    [images]
  );

  const setImageIdInURL = (id: string) => {
    window.location.hash = id;
  };

  const removeImageIdFromURL = () => {
    history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search
    );
  };

  useEffect(() => {
    const onHashChanged = async () => {
      // to trim the '#' symbol
      const hash = window.location.hash.slice(1);
      if (!hash) {
        setIsActive(false);
        setExpandedImage(undefined);
      }
      // see if the new hash is already in the imageMap
      if (imageMap[hash]) {
        // if it is, update the expanded image
        setExpandedImage(imageMap[hash]);
        setIsActive(true);
      } else {
        // if it's not, fetch the image and then update
        const { image } = await getImage({ id: hash, toggles });
        if (image.type === 'Image') {
          imageMap[image.id] = image;
          setExpandedImage(image);
        } else if (image.type === 'Error') {
          setExpandedImage(undefined);
          setIsActive(false);
        }
      }
    };
    onHashChanged();
    window.addEventListener('hashchange', onHashChanged);
    return () => {
      window.removeEventListener('hashchange', onHashChanged);
    };
  }, [imageMap]);

  useEffect(() => {
    if (isActive && expandedImage !== undefined) {
      setImageIdInURL(expandedImage?.id || '');
    } else {
      // clear the url of the fragments and includeing the # symbol
      removeImageIdFromURL();
    }
  }, [isActive, expandedImage]);

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
        src: image.locations[0].url,
        width: (image.aspectRatio || 1) * 100,
        height: 100,
      })),
    [images]
  );

  const renderRowContainer: RenderRowContainer = ({ children }) => {
    return <AlbumRow>{children}</AlbumRow>;
  };

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
              layout="fixed"
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
            {imagesWithDimensions.map((result: GalleryImageProps) => (
              <li key={result.id}>
                <Space
                  $h={{ size: 'l', properties: ['margin-right'] }}
                  $v={{ size: 'l', properties: ['margin-bottom'] }}
                >
                  <ImageCard
                    id={result.id}
                    workId={result.source.id}
                    image={{
                      contentUrl: result.src,
                      width: result.width * 1.57,
                      height: result.height * 1.57,
                      alt: result.source.title,
                    }}
                    onClick={event => {
                      if (isSmallGallery) {
                        event.preventDefault();
                        setExpandedImage(result);
                        setIsActive(true);
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
      <Modal
        id="expanded-image-dialog"
        dataTestId="image-modal"
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
