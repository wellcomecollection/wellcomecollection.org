// @flow
import NextLink from 'next/link';
import { workLink } from '@weco/common/services/catalogue/routes';
import { type Image as ImageType } from '@weco/common/model/catalogue';
import { font, classNames } from '@weco/common/utils/classnames';
import getAugmentedLicenseInfo from '@weco/common/utils/licenses';
import Image from '@weco/common/views/components/Image/Image';
import License from '@weco/common/views/components/License/License';
import { getWork } from '../../services/catalogue/works';
import { useEffect, useState, useRef, useContext } from 'react';
import useFocusTrap from '@weco/common/hooks/useFocusTrap';
import styled from 'styled-components';
import RelatedImages from '../RelatedImages/RelatedImages';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import getFocusableElements from '@weco/common/utils/get-focusable-elements';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

type Props = {|
  id: string,
  locations: $ElementType<ImageType, 'locations'>,
  sourceId: string,
  setExpandedImageId: (id: string) => void,
  onWorkLinkClick: () => void,
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
  color: ${props => props.theme.colors.white};
  border: 0;
  outline: 0;
  z-index: 1;

  &:focus {
    ${props =>
      !props.hideFocus && `border: 2px solid ${props.theme.colors.black}`}
  }

  .icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
  }

  ${props => props.theme.media.medium`
    background: none;
    color: ${props => props.theme.colors.pewter};
    position: absolute;
  `}
`;

const ExpandedEndpointImage = ({
  id,
  locations,
  sourceId,
  setExpandedImageId,
  onWorkLinkClick,
}: Props) => {
  const { isKeyboard } = useContext(AppContext);
  const [, setDetailedWork] = useState(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const endRef = useRef(null);

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

      setExpandedImageId('');
    }

    document.addEventListener('keydown', closeOnEscape);

    return () => document.removeEventListener('keydown', closeOnEscape);
  }, []);
  useEffect(() => {
    const fetchDetailedWork = async () => {
      const res = await getWork({ id });
      if (res.type === 'Work') {
        setDetailedWork(res);
      }
    };
    fetchDetailedWork();
  }, []);

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

  const location = locations[0];
  const license = location.license && getAugmentedLicenseInfo(location.license);

  return (
    <>
      <Overlay onClick={() => setExpandedImageId('')} />
      <Modal ref={modalRef}>
        <CloseButton
          hideFocus={!isKeyboard}
          ref={closeButtonRef}
          onClick={() => setExpandedImageId('')}
        >
          <span className="visually-hidden">Close modal window</span>
          <Icon name="cross" extraClasses={`icon--currentColor`} />
        </CloseButton>
        <ModalInner>
          <ImageWrapper>
            <Image
              defaultSize={400}
              alt=""
              contentUrl={location.url}
              tasl={null}
            />
            <Space v={{ size: 'm', properties: ['margin-top'] }}>
              {license && (
                <Space
                  className={font('hnl', 5)}
                  v={{ size: 'l', properties: ['margin-bottom'] }}
                >
                  <License license={license} />
                </Space>
              )}
              <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
                <NextLink {...workLink({ id: sourceId })} passHref>
                  <a
                    className={classNames({
                      'inline-block': true,
                      [font('hnl', 5)]: true,
                    })}
                    onClick={onWorkLinkClick}
                  >
                    More about the work containing this image
                  </a>
                </NextLink>
              </Space>
            </Space>
          </ImageWrapper>
          <InfoWrapper>
            <RelatedImages originalId={sourceId} />
          </InfoWrapper>
        </ModalInner>
      </Modal>
    </>
  );
};

export default ExpandedEndpointImage;
