import { Dispatch, FunctionComponent, SetStateAction } from 'react';

import Modal from '@weco/common/views/components/Modal';
import ExpandedImage from '@weco/content/components/ExpandedImage';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

type Props = {
  images: Image[];
  expandedImage?: Image;
  setExpandedImage: Dispatch<SetStateAction<Image | undefined>>;
};

const ExpandedImageModal: FunctionComponent<Props> = ({
  images,
  expandedImage,
  setExpandedImage,
}: Props) => {
  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const expandedImagePosition = images.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );

  return (
    <Modal
      id="expanded-image-dialog"
      dataTestId="image-modal"
      isActive={expandedImage !== undefined}
      setIsActive={() => setExpandedImage(undefined)}
      maxWidth="1020px"
    >
      <ExpandedImage
        resultPosition={expandedImagePosition}
        image={expandedImage}
        isActive={expandedImage !== undefined}
        setExpandedImage={setExpandedImage}
      />
    </Modal>
  );
};

export default ExpandedImageModal;
