import { FC, RefObject, useEffect, useState } from 'react';
import styled from 'styled-components';
import Icon from '@weco/common/views/components/Icon/Icon';
import { expand, cross } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import LL from '@weco/common/views/components/styled/LL';
import Image from 'next/image';
import { createPrismicLoader } from '@weco/common/views/components/PrismicImage/PrismicImage';
import { useToggles } from '@weco/common/server-data/Context';

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

  .icon {
    margin: 0;
  }
`;

const StyledDialog = styled.dialog<{ isLoaded: boolean }>`
  position: fixed;
  top: 0;
  bottom: 0;
  border: 0;
  padding: 0;
  margin: 0;
  max-width: 100%;
  max-height: 100%;
  height: 100vh;
  width: 100vw;
  justify-content: center;
  align-items: center;
  background: ${props => props.theme.color('neutral.700')};
  z-index: 3;

  &[open] {
    display: flex;
  }

  button {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  img {
    max-width: 100vw;
    max-height: 100vh;
    opacity: ${props => (props.isLoaded ? 1 : 0)};
    transform: scale(${props => (props.isLoaded ? 1 : 0.6)});
    transition: all ${props => props.theme.transitionProperties};
  }
`;

type ZoomedImageButtonProps = {
  zoomRef: RefObject<HTMLDialogElement>;
};

const ZoomedImageButton: FC<ZoomedImageButtonProps> = ({ zoomRef }) => {
  const { zoomImages } = useToggles();

  function openDialog() {
    zoomRef?.current?.showModal();
  }

  return zoomImages ? (
    <ZoomButton onClick={openDialog}>
      <Icon icon={expand} color="white" />
    </ZoomButton>
  ) : null;
};

type ZoomedImageProps = {
  image: ImageType;
  zoomRef: RefObject<HTMLDialogElement>;
};

const ZoomedImage: FC<ZoomedImageProps> = ({ image, zoomRef }) => {
  const { zoomImages } = useToggles();
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageWidth, setImageWidth] = useState(0);
  const [isZoom, setIsZoom] = useState(false);

  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'open') {
          const isOpen = Boolean(zoomRef.current?.hasAttribute('open'));
          setIsZoom(isOpen);
          setIsLoaded(!isOpen);
          const viewportWidth = document.documentElement.clientWidth;
          setImageWidth(viewportWidth);
        }
      });
    });

    zoomRef.current &&
      observer.observe(zoomRef.current, {
        attributes: true,
      });
  }, []);

  function closeDialog() {
    zoomRef?.current?.close();
    setIsLoaded(false);
  }

  return zoomImages ? (
    <StyledDialog ref={zoomRef} isLoaded={isLoaded}>
      {!isLoaded && <LL />}
      {isZoom && (
        <>
          <ZoomButton onClick={closeDialog}>
            <span className="visually-hidden">Close</span>
            <Icon icon={cross} color="white" />
          </ZoomButton>
          <Image
            width={image.width}
            height={image.height}
            layout="intrinsic"
            src={image.contentUrl}
            alt={image.alt || ''}
            objectFit="contain"
            loader={createPrismicLoader(imageWidth, 'high')}
            onLoadingComplete={() => setIsLoaded(true)}
          />
        </>
      )}
    </StyledDialog>
  ) : null;
};

export { ZoomedImage, ZoomedImageButton };
