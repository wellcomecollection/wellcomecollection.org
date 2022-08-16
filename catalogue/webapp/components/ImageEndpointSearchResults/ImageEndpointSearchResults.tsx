import { FunctionComponent, useState } from 'react';

// Types
import { Image, CatalogueResultsList } from '@weco/common/model/catalogue';

// Components
import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import Modal from '@weco/common/views/components/Modal/Modal';

// Styles
import styled from 'styled-components';

type Props = {
  images: CatalogueResultsList<Image>;
  isScroller?: boolean;
};

const ImagesContainer = styled.ul.attrs<{ isScroller: boolean }>({
  role: 'list',
})<{ isScroller: boolean }>`
  ${({ isScroller }) =>
    isScroller ? 'overflow-y: scroll; padding: 0.5rem 0;' : ''};
`;

const ImageEndpointSearchResults: FunctionComponent<Props> = ({
  images,
  isScroller = false,
}: Props) => {
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const expandedImagePosition = images.results.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );
  const [isActive, setIsActive] = useState(false);

  return (
    <ImagesContainer
      className={`flex plain-list ${
        !isScroller && 'flex--wrap no-padding no-margin'
      }`}
      isScroller={isScroller}
    >
      {images.results.map((result: Image) => (
        <li key={result.id} role="listitem">
          <ImageCard
            id={result.id}
            workId={result.source.id}
            image={{
              contentUrl: result.locations[0]?.url,
              width: 300,
              height: 300,
              alt: '',
            }}
            thumbHeight={240}
            hasMarginBottom={false}
            onClick={event => {
              event.preventDefault();
              setExpandedImage(result);
              setIsActive(true);
            }}
          />
        </li>
      ))}
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
    </ImagesContainer>
  );
};

export default ImageEndpointSearchResults;
