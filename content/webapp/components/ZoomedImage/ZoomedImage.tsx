import { FC, Dispatch, SetStateAction, RefObject } from 'react';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import { expand, cross } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';

const ZoomButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  color: ${props => props.theme.color('white')};
  background: ${props => props.theme.color('black')};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 0;
  padding: 0;
  margin: 0;
`;

const StyledDialog = styled.dialog`
  border: 0;
  padding: 0;
  max-width: 100%;
  max-height: 100%;
  background: ${props => props.theme.color('black')};

  img {
    width: 100vw;
    height: 100vh;
    display: block;
    object-fit: contain;
  }

  button {
    position: absolute;
    top: 10px;
    right: 10px;
  }
`;

type ZoomedImageButtonProps = {
  setIsZoom: Dispatch<SetStateAction<boolean>>;
  zoomRef: RefObject<HTMLDialogElement>;
};

const ZoomedImageButton: FC<ZoomedImageButtonProps> = ({
  setIsZoom,
  zoomRef,
}) => {
  function openDialog() {
    zoomRef?.current?.showModal();
    setIsZoom(true);
  }

  return (
    <ZoomButton onClick={openDialog}>
      <Icon icon={expand} color="white" />
    </ZoomButton>
  );
};

type ZoomedImageProps = {
  image: ImageType;
  zoomRef: RefObject<HTMLDialogElement>;
  isZoom: boolean;
};

const ZoomedImage: FC<ZoomedImageProps> = ({ image, zoomRef, isZoom }) => {
  function closeDialog() {
    zoomRef?.current?.close();
  }

  return (
    <StyledDialog ref={zoomRef}>
      {isZoom && (
        <>
          <ZoomButton onClick={closeDialog}>
            <Icon icon={cross} color="white" />
          </ZoomButton>
          <img src={image.contentUrl} alt={image.alt || ''} />
        </>
      )}
    </StyledDialog>
  );
};

export { ZoomedImage, ZoomedImageButton };
