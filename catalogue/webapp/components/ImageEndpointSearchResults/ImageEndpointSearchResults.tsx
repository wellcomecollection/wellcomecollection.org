import {
  FunctionComponent,
  useMemo,
  useState,
  useContext,
  useEffect,
} from 'react';
import PhotoAlbum, {
  RenderPhotoProps,
  RenderRowContainer,
} from 'react-photo-album';
import styled from 'styled-components';

import { hexToRgb } from '@weco/common/utils/convert-colors';
import { Image } from '@weco/catalogue/services/wellcome/catalogue/types';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import Modal from '@weco/common/views/components/Modal/Modal';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { useRouter } from 'next/router';
import { parse, stringify } from 'querystring';

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
}: Props) => {
  const { isFullSupportBrowser } = useContext(AppContext);
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  const [isActive, setIsActive] = useState(false);
  const router = useRouter();

  const getImage = async routerImageId => {
    const apiUrl = `https://api.wellcomecollection.org/catalogue/v2/images/${routerImageId}`;
    const image: Image = await fetch(apiUrl).then(res => res.json());

    if (image) {
      setExpandedImage(image);
      setIsActive(true);
    }
  };

  const encodeDecodeImageIdInUrl = (mode: 'encode' | 'decode') => {
    const searchTest = window.location.search;
    const search = searchTest?.slice(1) || '';
    const params = parse(search);

    if (mode === 'encode') {
      params.imageId = expandedImage?.id;
    }
    if (mode === 'decode') {
      delete params.imageId;
    }

    router.push(`${router.pathname}?${stringify(params)}`, undefined, {
      shallow: true,
    });
  };

  useEffect(() => {
    if (isActive) {
      encodeDecodeImageIdInUrl('encode');
    } else {
      encodeDecodeImageIdInUrl('decode');
    }
  }, [isActive, expandedImage]);

  useEffect(() => {
    if (isActive) {
      const routerImageId = router.query.imageId;
      if (routerImageId && routerImageId !== expandedImage?.id) {
        getImage(routerImageId);
      }
      if (!routerImageId) {
        setExpandedImage(undefined);
        setIsActive(false);
      }
    }
  }, [router.query]);

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
        <GalleryContainer data-test-id="image-search-results-container">
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
      )}
      {(!isFullSupportBrowser || isSmallGallery) && (
        <ImageCardList data-test-id="image-search-results-container">
          {imagesWithDimensions.map((result: GalleryImageProps) => (
            <li key={result.id}>
              <Space
                h={{ size: 'l', properties: ['margin-right'] }}
                v={{ size: 'l', properties: ['margin-bottom'] }}
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
