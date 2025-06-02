import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { ServerDataContext } from '@weco/common/server-data/Context';
import Modal from '@weco/common/views/components/Modal';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import ExpandedImage from '@weco/content/components/ExpandedImage';
import ImageCard from '@weco/content/components/ImageCard';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import ImageScrollButtons from './ImageScrollButtons';

const ImageCardList = styled(PlainList)`
  display: flex;
`;

type Props = {
  images: Image[];
};

const ImageSectionGallery: FunctionComponent<Props> = ({ images }: Props) => {
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
      // clear the url of the fragments and also removes the # symbol
      setImageIdInURL('');
    }
  }, [isActive, expandedImage]);

  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const expandedImagePosition = images.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );

  const scrollContainerRef = useRef<HTMLElement>(null);

  return (
    <>
      <ImageScrollButtons targetRef={scrollContainerRef}></ImageScrollButtons>
      <div data-testid="image-search-results-container">
        <ImageCardList ref={scrollContainerRef} style={{ overflowX: 'hidden' }}>
          {images.map((image, index) => (
            <li key={image.id}>
              <Space
                $h={{ size: 'l', properties: ['margin-right'] }}
                $v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                <ImageCard
                  id={image.id}
                  workId={image.source.id}
                  positionInList={index + 1}
                  image={{
                    contentUrl: image.locations[0].url,
                    width: 200 * (image.aspectRatio || 1),
                    height: 200,
                    alt: image.source.title,
                  }}
                  onClick={event => {
                    event.preventDefault();
                    setExpandedImage(image);
                    setIsActive(true);
                  }}
                  layout="fixed"
                />
              </Space>
            </li>
          ))}
        </ImageCardList>
      </div>
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

export default ImageSectionGallery;
