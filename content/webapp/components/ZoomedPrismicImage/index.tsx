import Image from 'next/image';
import {
  FunctionComponent,
  RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { cross, expand } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import Icon from '@weco/common/views/components/Icon';
import { createPrismicLoader } from '@weco/common/views/components/PrismicImage';
import LL from '@weco/common/views/components/styled/LL';

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
  padding: 0;
  margin: 0;

  .icon {
    margin: 0;
  }
`;

const StyledDialog = styled.dialog<{ $isLoaded: boolean }>`
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
    opacity: ${props => (props.$isLoaded ? 1 : 0)};
    transform: scale(${props => (props.$isLoaded ? 1 : 0.6)});
    transition: all ${props => props.theme.transitionProperties};

    @media (prefers-reduced-motion) {
      transform: scale(1);
    }
  }
`;

type ZoomedPrismicImageProps = {
  image: ImageType;
};

const ZoomedPrismicImage: FunctionComponent<ZoomedPrismicImageProps> = ({
  image,
}) => {
  const [canShowZoom, setCanShowZoom] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageWidth, setImageWidth] = useState(0);
  const [isZoom, setIsZoom] = useState(false);
  const zoomRef: RefObject<HTMLDialogElement> = useRef(null);

  function openDialog() {
    zoomRef?.current?.showModal();
    const viewportWidth = document.documentElement.clientWidth;
    setImageWidth(viewportWidth);
    setIsZoom(true);
  }

  useEffect(() => {
    // Don't show zoom button on browsers where the API doesn't exist (e.g.
    // IE11)
    const testDialog = document.createElement('dialog');
    setCanShowZoom(Boolean(testDialog.showModal));
  }, []);

  useEffect(() => {
    function handleClose() {
      setIsZoom(false);
      setIsLoaded(false);
    }

    zoomRef?.current?.addEventListener('close', handleClose);

    return zoomRef?.current?.removeEventListener('close', handleClose);
  }, []);

  function closeDialog() {
    zoomRef?.current?.close();
    setIsZoom(false);
    setIsLoaded(false);
  }

  return canShowZoom ? (
    <>
      <ZoomButton
        data-gtm-trigger="zoom_prismic_image_button"
        onClick={openDialog}
      >
        <span className="visually-hidden">Zoom image</span>
        <Icon icon={expand} iconColor="white" />
      </ZoomButton>
      <StyledDialog ref={zoomRef} $isLoaded={isLoaded}>
        {!isLoaded && <LL />}
        {isZoom && (
          <>
            <ZoomButton onClick={closeDialog}>
              <span className="visually-hidden">Close zoomed image</span>
              <Icon icon={cross} iconColor="white" />
            </ZoomButton>
            <Image
              width={image.width}
              height={image.height}
              src={image.contentUrl}
              alt={image.alt || ''}
              loader={createPrismicLoader(imageWidth, 'high')}
              onLoadingComplete={() => setIsLoaded(true)}
              style={{
                maxWidth: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </>
        )}
      </StyledDialog>
    </>
  ) : null;
};

export default ZoomedPrismicImage;
