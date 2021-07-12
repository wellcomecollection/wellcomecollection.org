import {
  getCanvases,
  getFirstChildManifestLocation,
  getServiceId,
} from '@weco/common/utils/iiif';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';
import fetch from 'isomorphic-unfetch';
import NextLink from 'next/link';
import { font, classNames } from '@weco/common/utils/classnames';
import {
  getDigitalLocationOfType,
  sierraIdFromPresentationManifestUrl,
} from '@weco/common/utils/works';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import Image from '@weco/common/views/components/Image/Image';
import License from '@weco/common/views/components/License/License';
import { Image as ImageType, Work } from '@weco/common/model/catalogue';
import { getWork } from '../../services/catalogue/works';
import {
  useEffect,
  useState,
  useRef,
  useContext,
  FunctionComponent,
} from 'react';
import useFocusTrap from '@weco/common/hooks/useFocusTrap';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import VisuallySimilarImagesFromApi from '../VisuallySimilarImagesFromApi/VisuallySimilarImagesFromApi';
import WorkLink from '@weco/common/views/components/WorkLink/WorkLink';
import { expandedViewImageButton } from '@weco/common/text/aria-labels';
import { toLink as itemLink } from '@weco/common/views/components/ItemLink/ItemLink';
import { toLink as imageLink } from '@weco/common/views/components/ImageLink/ImageLink';

type Props = {
  image: ImageType;
  setExpandedImage: (image?: ImageType) => void;
  onWorkLinkClick: () => void;
  onImageLinkClick: () => void;
  id?: string;
  resultPosition: number;
};

type CanvasLink = {
  canvas: number;
  sierraId: string;
};

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

type CloseButtonProps = {
  hideFocus: boolean;
};

const CloseButton = styled(Space).attrs({
  v: { size: 'm', properties: ['top'] },
  h: { size: 'm', properties: ['left'] },
})<CloseButtonProps>`
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

const trackingSource = 'images_search_result';

const ExpandedImage: FunctionComponent<Props> = ({
  image,
  setExpandedImage,
  onWorkLinkClick,
  onImageLinkClick,
  id,
  resultPosition,
}: Props) => {
  const { isKeyboard } = useContext(AppContext);
  const toggles = useContext(TogglesContext);
  const [detailedWork, setDetailedWork] = useState<Work | undefined>();
  const [canvasDeeplink, setCanvasDeeplink] = useState<
    CanvasLink | undefined
  >();
  const modalRef = useRef(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const endRef = useRef<HTMLElement>();

  const workId = image.source.id;
  const displayTitle = detailedWork?.title ?? '';
  const displayContributor = detailedWork?.contributors?.[0]?.agent?.label;

  useEffect(() => {
    const focusables =
      (modalRef?.current && [...getFocusableElements(modalRef.current)]) || [];

    endRef.current = focusables?.[focusables.length - 1];
  }, [modalRef.current]);

  useEffect(() => closeButtonRef?.current?.focus(), []);

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
    if (detailedWork) {
      const manifestLocation = getDigitalLocationOfType(
        detailedWork,
        'iiif-presentation'
      );
      if (manifestLocation) {
        fetchDeeplinkCanvasIndex(manifestLocation.url, image.locations[0]?.url);
      }
    }
  }, [detailedWork]);

  useEffect(() => {
    document?.documentElement?.classList.add('is-scroll-locked');

    return () => {
      document?.documentElement?.classList.remove('is-scroll-locked');
    };
  }, []);

  useFocusTrap(closeButtonRef, endRef);

  const iiifImageLocation = image.locations[0];
  const license =
    iiifImageLocation?.license &&
    getAugmentedLicenseInfo(iiifImageLocation.license);

  const expandedImageLink =
    image && !canvasDeeplink
      ? imageLink(
          {
            workId,
            id: image.id,
            resultPosition,
          },
          trackingSource
        )
      : detailedWork &&
        itemLink(
          {
            workId,
            resultPosition: resultPosition,
            ...(canvasDeeplink || {}),
          },
          trackingSource
        );

  return (
    <div role="dialog" id={id} aria-modal={true}>
      <Overlay onClick={() => setExpandedImage(undefined)} />
      <Modal ref={modalRef}>
        <CloseButton
          hideFocus={!isKeyboard}
          as="button"
          ref={closeButtonRef}
          onClick={() => setExpandedImage(undefined)}
        >
          <span className="visually-hidden">Close modal window</span>
          <Icon name="cross" color={'currentColor'} />
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
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <h2
                className={classNames({
                  [font('hnb', 3)]: true,
                  'no-margin': true,
                })}
              >
                {displayTitle}
              </h2>
              {displayContributor && (
                <Space
                  as="h3"
                  v={{ size: 's', properties: ['margin-top'] }}
                  className={classNames({ [font('hnb', 5)]: true })}
                >
                  {displayContributor}
                </Space>
              )}
            </Space>
            {license && (
              <Space
                className={font('hnr', 5)}
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
                    clickHandler={onImageLinkClick}
                    ariaLabel={expandedViewImageButton}
                  />
                </Space>
              )}
              <WorkLink
                id={workId}
                source={trackingSource}
                resultPosition={resultPosition}
              >
                <a
                  className={classNames({
                    'inline-block': true,
                    [font('hnr', 5)]: true,
                  })}
                  onClick={onWorkLinkClick}
                >
                  More about this work
                </a>
              </WorkLink>
            </Space>
            <VisuallySimilarImagesFromApi
              originalId={image.id}
              onClickImage={setExpandedImage}
            />
          </InfoWrapper>
        </ModalInner>
      </Modal>
    </div>
  );
};

export default ExpandedImage;
