// @flow
import {
  getCanvases,
  getFirstChildManifestLocation,
  getServiceId,
} from '@weco/common/utils/iiif';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import fetch from 'isomorphic-unfetch';
import NextLink from 'next/link';
import {
  workLink,
  itemLink,
  imageLink,
} from '@weco/common/services/catalogue/routes';
import { font, classNames } from '@weco/common/utils/classnames';
import {
  getDigitalLocationOfType,
  sierraIdFromPresentationManifestUrl,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
// $FlowFixMe (tsx)
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import Image from '@weco/common/views/components/Image/Image';
import License from '@weco/common/views/components/License/License';
import { type Image as ImageType } from '@weco/common/model/catalogue';
import { getWork } from '../../services/catalogue/works';
import { useEffect, useState, useRef, useContext } from 'react';
import useFocusTrap from '@weco/common/hooks/useFocusTrap';
import styled from 'styled-components';
import VisuallySimilarImages from '../VisuallySimilarImages/VisuallySimilarImages';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import VisuallySimilarImagesFromApi from '../VisuallySimilarImagesFromApi/VisuallySimilarImagesFromApi';

type Props = {|
  title: string,
  workId: string,
  image?: ImageType,
  setExpandedImage: (image: ?ImageType) => void,
  onWorkLinkClick: () => void,
  onImageLinkClick: (id: string) => void,
|};

const ImageWrapper = styled(Space).attrs({
  as: 'a',
  v: { size: 'm', properties: ['margin-bottom'] },
})`
  ${props => props.theme.media.medium`
    flex-basis: 40%;
    order: 2;
  `}

  img {
    transform: translateX(-50%);
    left: 50%;
    position: relative;
    max-height: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
  }
`;

const InfoWrapper = styled.div`
  ${props => props.theme.media.medium`
    flex-basis: 60%;
    padding-right: 20px;
    order: 1;
    height: 100%;
  `}
`;

const Overlay = styled.div.attrs({})`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  background: rgba(0, 0, 0, 0.5);
`;

const Modal = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'xl', properties: ['padding-left', 'padding-right'] },
  className: classNames({
    'shadow bg-white': true,
  }),
})`
  z-index: 1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  overflow: auto;

  ${props => props.theme.media.medium`
    top: 50%;
    left: 50%;
    right: auto;
    bottom: auto;
    transform: translateX(-50%) translateY(-50%);
    height: auto;
    max-height: 90vh;
    width: 80vw;
    max-width: ${props.theme.sizes.large}px
    border-radius: ${props.theme.borderRadiusUnit}px;
    display: flex;
    overflow: hidden;

    &:after {
      pointer-events: none;
      content: '';
      position: absolute;
      bottom: 40px;
      left: 0;
      width: 60%;
      height: 40px;
      background: linear-gradient(
        0deg,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0) 100%
      );
    }
  `}
`;

const ModalInner = styled.div`
  ${props => props.theme.media.medium`
    overflow: auto;
    display: flex;
  `}
`;

const CloseButton = styled(Space).attrs({
  as: 'button',
  v: { size: 'm', properties: ['top'] },
  h: { size: 'm', properties: ['left'] },
})`
  position: fixed;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  appearance: none;
  background: rgba(0, 0, 0, 0.7);
  color: ${props => props.theme.color('white')};
  border: 0;
  outline: 0;
  z-index: 1;

  &:focus {
    ${props =>
      !props.hideFocus && `border: 2px solid ${props.theme.color('black')}`}
  }

  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  ${props => props.theme.media.medium`
    background: none;
    color: ${props => props.theme.color('pewter')};
    position: absolute;
  `}
`;

const ExpandedImage = ({
  title,
  workId,
  image,
  setExpandedImage,
  onWorkLinkClick,
  onImageLinkClick,
}: Props) => {
  const { isKeyboard } = useContext(AppContext);
  const toggles = useContext(TogglesContext);
  const [detailedWork, setDetailedWork] = useState(null);
  const [canvasDeeplink, setCanvasDeeplink] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const endRef = useRef(null);

  const displayTitle = title || (detailedWork && detailedWork.title) || '';

  useEffect(() => {
    const focusables = modalRef &&
      modalRef.current && [...getFocusableElements(modalRef.current)];
    endRef.current = focusables && focusables[focusables.length - 1];
  }, [modalRef.current]);

  useEffect(
    () =>
      closeButtonRef &&
      closeButtonRef.current &&
      closeButtonRef.current.focus(),
    []
  );

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== 'Escape') return;

      setExpandedImage(undefined);
    }

    document.addEventListener('keydown', closeOnEscape);

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);

  useEffect(() => {
    const fetchDetailedWork = async () => {
      const res = await getWork({ id: workId, toggles });
      if (res.type === 'Work') {
        setDetailedWork(res);
      }
    };
    fetchDetailedWork();
  }, [workId]);

  useEffect(() => {
    // This downloads the IIIF manifest and tries to find the image in the canvases.
    // With upcoming work on IIIF identifiers, we should be able to provide the
    // deep link information from the API directly, but for now this is a
    // pragmatic - if ugly - solution.
    const fetchDeeplinkCanvasIndex = async (
      manifestLocation: string,
      imageUrl: string
    ) => {
      const res = await fetch(manifestLocation);
      const manifest = await res.json();
      const firstChildManifestLocation = getFirstChildManifestLocation(
        manifest
      );
      if (firstChildManifestLocation) {
        return fetchDeeplinkCanvasIndex(firstChildManifestLocation, imageUrl);
      }
      const canvases = getCanvases(manifest);
      const imageLocationBase = imageUrl.replace('/info.json', '');
      const canvasIndex = canvases.findIndex(canvas => {
        const serviceId = getServiceId(canvas);
        return serviceId && serviceId.indexOf(imageLocationBase) !== -1;
      });
      const sierraId = sierraIdFromPresentationManifestUrl(manifestLocation);
      if (canvasIndex !== -1) {
        setCanvasDeeplink({
          canvas: canvasIndex + 1,
          sierraId,
        });
      }
    };
    if (detailedWork && image && image.locations[0]) {
      const manifestLocation = getDigitalLocationOfType(
        detailedWork,
        'iiif-presentation'
      );
      if (manifestLocation) {
        fetchDeeplinkCanvasIndex(manifestLocation.url, image.locations[0].url);
      }
    }
  }, [detailedWork]);

  useEffect(() => {
    document &&
      document.documentElement &&
      document.documentElement.classList.add('is-scroll-locked');

    return () => {
      document &&
        document.documentElement &&
        document.documentElement.classList.remove('is-scroll-locked');
    };
  }, []);

  useFocusTrap(closeButtonRef, endRef);

  const iiifImageLocation = image
    ? image.locations[0]
    : detailedWork && getDigitalLocationOfType(detailedWork, 'iiif-image');
  const license =
    iiifImageLocation &&
    iiifImageLocation.license &&
    getAugmentedLicenseInfo(iiifImageLocation.license);

  const expandedImageLink =
    image && !canvasDeeplink
      ? imageLink({ workId, id: image.id })
      : detailedWork &&
        itemLink({
          workId,
          langCode: detailedWork.language && detailedWork.language.id,
          ...(canvasDeeplink || {}),
        });

  return (
    <>
      <Overlay onClick={() => setExpandedImage(undefined)} />
      <Modal ref={modalRef}>
        <CloseButton
          hideFocus={!isKeyboard}
          ref={closeButtonRef}
          onClick={() => setExpandedImage(undefined)}
        >
          <span className="visually-hidden">Close modal window</span>
          <Icon name="cross" extraClasses={`icon--currentColor`} />
        </CloseButton>
        <ModalInner>
          {iiifImageLocation && expandedImageLink && (
            <NextLink {...expandedImageLink} passHref>
              <ImageWrapper>
                <Image
                  defaultSize={400}
                  alt={displayTitle}
                  contentUrl={iiifImageLocation.url}
                  tasl={null}
                  lazyload={false}
                />
              </ImageWrapper>
            </NextLink>
          )}
          <InfoWrapper>
            <Space
              as="h2"
              v={{ size: 'l', properties: ['margin-bottom'] }}
              className={classNames({
                [font('hnm', 3)]: true,
                'no-margin': true,
              })}
            >
              {displayTitle}
            </Space>
            {license && (
              <Space
                className={font('hnl', 5)}
                v={{ size: 'l', properties: ['margin-bottom'] }}
              >
                <License license={license} />
              </Space>
            )}

            <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
              {expandedImageLink && (
                <Space
                  h={{ size: 'm', properties: ['margin-right'] }}
                  className="inline-block"
                >
                  <ButtonSolidLink
                    text="View image"
                    icon="eye"
                    link={expandedImageLink}
                  />
                </Space>
              )}
              <NextLink {...workLink({ id: workId })} passHref>
                <a
                  className={classNames({
                    'inline-block': true,
                    [font('hnl', 5)]: true,
                  })}
                  onClick={onWorkLinkClick}
                >
                  More about this work
                </a>
              </NextLink>
            </Space>
            {image ? (
              <VisuallySimilarImagesFromApi
                originalId={image.id}
                onClickImage={setExpandedImage}
              />
            ) : (
              <VisuallySimilarImages originalId={workId} />
            )}
          </InfoWrapper>
        </ModalInner>
      </Modal>
    </>
  );
};

export default ExpandedImage;
