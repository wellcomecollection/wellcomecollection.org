import {
  FunctionComponent,
  useState,
  useRef,
  useEffect,
  useContext,
} from 'react';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import { CaptionedImage as CaptionedImageProps } from '@weco/common/model/captioned-image';
import { repeatingLsBlack } from '@weco/common/utils/backgrounds';
import { trackEvent } from '@weco/common/utils/ga';
import CaptionedImage from '../CaptionedImage/CaptionedImage';
import WobblyEdge from '@weco/common/views/components/WobblyEdge/WobblyEdge';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import Icon from '@weco/common/views/components/Icon/Icon';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Space from '@weco/common/views/components/styled/Space';
import { cross, gallery } from '@weco/common/icons';
import { PageBackgroundContext } from '../ContentPage/ContentPage';

const GalleryTitle = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
  as: 'span',
  className: classNames({
    'flex flex--v-top': true,
  }),
})``;

const Gallery = styled.div.attrs({
  className: 'row relative',
})<{
  isActive: boolean;
  isStandalone: boolean;
  pageBackground: 'cream' | 'white';
}>`
  .caption {
    display: none;
  }

  .tasl {
    display: none;
  }

  img {
    transition: filter 400ms ease;
  }

  ${props =>
    !props.isActive &&
    `
      img:hover {
        filter: brightness(80%);
      }
    `}

  ${props =>
    props.isActive &&
    `
    .caption {
      display: block;
    }

    .tasl {
      display: inherit;
    }

    color: ${props.theme.color('white')};
    background: linear-gradient(
      ${props.theme.color(props.pageBackground)} 100px,
      ${props.theme.color('charcoal')} 100px
    );

    @media (min-width: ${props.theme.sizes.medium}px) {
      background: linear-gradient(
        ${props.theme.color(props.pageBackground)} 200px,
        ${props.theme.color('charcoal')} 200px
      );

      ${
        props.isStandalone &&
        `
        background: ${props.theme.color('charcoal')};
      `
      }
    }
  `}

  transition: all 400ms ease;

  ${props =>
    props.isStandalone &&
    `
    background: ${props.theme.color('charcoal')};

    &:before {
      top: 0;

      @media (min-width: ${props.theme.sizes.medium}px) {
        top: 0;
      }
    }
  `}

  .close-wrapper {
    display: none;

    .enhanced & {
      display: inherit;
      top: 100px;
      bottom: 0;
      width: 100%;
      pointer-events: none;

      @media (min-width: ${props => props.theme.sizes.medium}px) {
        top: 200px;
      }
    }
  }

  .close {
    position: sticky;
    top: 18px;
    transform: translateX(calc((100vw - 100%) / 2));
    z-index: 3;
    pointer-events: all;
  }

  .background {
    top: 100px;
    opacity: 0;
    transition: opacity 400ms ease;

    @media (min-width: ${props => props.theme.sizes.medium}px) {
      top: 200px;

      ${props =>
        props.isStandalone &&
        `
        top: 0;
      `}

      ${props =>
        props.isActive &&
        `
        opacity: 0.1;
      `}
    }

    ${props =>
      props.isActive &&
      `
      opacity: 0.1;
    `}

    ${props =>
      props.isStandalone &&
      `
      top: 0;
    `}
  }

  .standalone-wobbly-edge {
    top: 0;
    width: 100%;
    z-index: 2;
  }

  .wobbly-edge-wrapper {
    bottom: -2px;
    width: 100%;
  }
`;

const ButtonContainer = styled.div<{ isHidden: boolean }>`
  display: ${props => (props.isHidden ? 'none' : 'block')};
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  z-index: 2;
`;

export type Props = {
  title?: string;
  items: CaptionedImageProps[];
  isStandalone: boolean;
};

const ImageGallery: FunctionComponent<{ id: number } & Props> = ({
  id,
  title,
  items,
  isStandalone,
}) => {
  const [isActive, setIsActive] = useState(true);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pageBackground = useContext(PageBackgroundContext);

  useEffect(() => {
    !isStandalone && setIsActive(false);
  }, []);

  function handleOpenClicked() {
    if (closeButtonRef.current) {
      closeButtonRef.current.tabIndex = 0;
      closeButtonRef.current.focus();
      showAllImages(true);
    }

    if (openButtonRef.current) {
      openButtonRef.current.tabIndex = -1;
    }
  }

  function handleCloseClicked() {
    if (openButtonRef.current) {
      openButtonRef.current.tabIndex = 0;
      setIsActive(false);

      if (headingRef.current) {
        headingRef.current.scrollIntoView();
      }

      trackEvent({
        category: `Control`,
        action: 'close ImageGallery',
        label: id.toString(),
      });
    }

    if (closeButtonRef.current) {
      closeButtonRef.current.tabIndex = -1;
    }
  }

  function showAllImages(isButton?: boolean) {
    trackEvent({
      category: `${isButton ? 'Button' : 'CaptionedImage'}`,
      action: 'open ImageGallery',
      label: id.toString(),
    });

    setIsActive(true);
  }

  const itemsToShow = () => {
    return isActive ? items : [items[0]];
  };

  return (
    <>
      {!isStandalone && (
        <Layout8>
          <GalleryTitle>
            <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
              <Icon icon={gallery} />
            </Space>
            <h2 id={`gallery-${id}`} className="h2 no-margin" ref={headingRef}>
              {title || 'In pictures'}
            </h2>
          </GalleryTitle>
        </Layout8>
      )}
      <Gallery
        isActive={isActive}
        isStandalone={isStandalone}
        id={`image-gallery-${id}`}
        pageBackground={pageBackground}
      >
        <div
          className={classNames({
            'absolute background': true,
          })}
          style={{
            bottom: 0,
            width: `100%`,
            background: `url(${repeatingLsBlack}) no-repeat top center`,
          }}
        />
        <Layout12>
          <Space
            v={
              isStandalone
                ? {
                    size: 'xl',
                    properties: ['padding-top'],
                  }
                : undefined
            }
            className={classNames({
              relative: true,
            })}
          >
            {isStandalone && (
              <div className="absolute standalone-wobbly-edge">
                <WobblyEdge isRotated={true} background="white" />
              </div>
            )}
            {!isActive && (
              <div className="wobbly-edge-wrapper absolute">
                <WobblyEdge background={pageBackground} />
              </div>
            )}

            {!isStandalone && (
              <Space
                v={{
                  size: 'm',
                  properties: ['padding-top'],
                }}
                className={classNames({
                  'close-wrapper absolute': true,
                })}
              >
                <Space
                  v={{
                    size: 'm',
                    properties: ['padding-bottom'],
                  }}
                  h={{ size: 'm', properties: ['padding-right'] }}
                  className={classNames({
                    'flex flex-end': true,
                    close: true,
                    'is-hidden': !isActive,
                  })}
                >
                  <Control
                    tabIndex={-1}
                    ariaControls={`image-gallery-${id}`}
                    ariaExpanded={isActive}
                    ref={closeButtonRef}
                    replace={true}
                    colorScheme="light"
                    text="close"
                    icon={cross}
                    clickHandler={handleCloseClicked}
                  />
                </Space>
              </Space>
            )}
            {itemsToShow().map((captionedImage, i) => (
              <Space
                v={
                  isActive
                    ? {
                        size: 'xl',
                        properties: ['margin-bottom'],
                      }
                    : undefined
                }
                onClick={() => {
                  if (!isActive) {
                    handleOpenClicked();
                  }
                }}
                key={captionedImage.image.contentUrl}
                style={{
                  cursor: !isActive ? 'pointer' : 'default',
                }}
              >
                <CaptionedImage
                  image={captionedImage.image}
                  caption={captionedImage.caption}
                  preCaptionNode={
                    items.length > 1 ? (
                      <Space
                        v={{
                          size: 'm',
                          properties: ['margin-bottom'],
                        }}
                        className={classNames({
                          [font('intb', 5)]: true,
                        })}
                      >
                        {i + 1} of {items.length}
                      </Space>
                    ) : null
                  }
                />
              </Space>
            ))}

            {!isStandalone && (
              <ButtonContainer isHidden={isActive}>
                <ButtonSolid
                  ref={openButtonRef}
                  ariaControls={`image-gallery-${id}`}
                  ariaExpanded={isActive}
                  icon={gallery}
                  clickHandler={handleOpenClicked}
                  text={`${items.length} images`}
                />
              </ButtonContainer>
            )}
          </Space>
        </Layout12>
      </Gallery>
    </>
  );
};

export default ImageGallery;
