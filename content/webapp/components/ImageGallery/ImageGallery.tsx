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
import { breakpoints } from '@weco/common/utils/breakpoints';
import { trackEvent } from '@weco/common/utils/ga';
import { CaptionedImage } from '@weco/common/views/components/Images/Images';
import WobblyEdge from '@weco/common/views/components/WobblyEdge/WobblyEdge';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import Icon from '@weco/common/views/components/Icon/Icon';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import Space from '@weco/common/views/components/styled/Space';
import { cross, gallery } from '@weco/common/icons';
import { PageBackgroundContext } from '../ContentPage/ContentPage';

type TitleStyle = {
  transform?: string;
  maxWidth?: string;
  opacity?: number;
};

const GalleryTitle = styled(Space).attrs<{
  titleStyle: TitleStyle;
  isEnhanced: boolean;
}>(props => ({
  v: { size: 'm', properties: ['margin-bottom'] },
  as: 'span',
  style: props.titleStyle,
  className: classNames({
    'flex flex--v-top': true,
  }),
}))<{ titleStyle: TitleStyle; isEnhanced: boolean }>`
  ${props =>
    props.isEnhanced &&
    `
    opacity: 0;
  `}
`;

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

    .captioned-image__image-container {
      background: ${props.theme.color('charcoal')};

      &:before {
        display: none;
      }
      &:hover:before {
        opacity: 0;
      }
    }
  `}

  .captioned-image__image-container {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      opacity: 0;
      background: ${props => props.theme.color('charcoal')};
      transition: opacity 400ms ease;
    }

    &:hover:before {
      opacity: 0.3;
    }
  }

  &:before {
    content: '';
    position: absolute;
    top: 100px;
    right: 0;
    left: 0;
    bottom: 0;
    transition: all 400ms ease;

    @include respond-to('medium') {
      top: 200px;
    }
  }

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

type Props = {
  id: string;
  title?: string;
  items: CaptionedImageProps[];
  isStandalone: boolean;
};

const ImageGallery: FunctionComponent<Props> = ({
  id,
  title,
  items,
  isStandalone,
}) => {
  const [isActive, setIsActive] = useState(true);
  const [titleStyle, setTitleStyle] = useState<TitleStyle>({
    transform: undefined,
    maxWidth: undefined,
    opacity: undefined,
  });
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const { isEnhanced } = useContext(AppContext);
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
        label: id,
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
      label: id,
    });

    setIsActive(true);
  }

  const itemsToShow = () => {
    return isActive ? items : [items[0]];
  };

  // We want the image gallery title to be aligned with the first image
  // So we adjust the translateX and width accordingly
  function updateTitleStyle(value: number) {
    setTitleStyle({
      transform: `translateX(calc((100vw - ${value}px) / 2))`,
      maxWidth: `${value}px`,
      opacity: 1,
    });
  }

  return (
    <>
      {!isStandalone && (
        <GalleryTitle titleStyle={titleStyle} isEnhanced={isEnhanced}>
          <Space as="span" h={{ size: 's', properties: ['margin-right'] }}>
            <Icon icon={gallery} />
          </Space>
          <h2 id={`gallery-${id}`} className="h2 no-margin" ref={headingRef}>
            {title || 'In pictures'}
          </h2>
        </GalleryTitle>
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
                <WobblyEdge isRotated={true} background={'white'} />
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
                    colorScheme={`light`}
                    text={`close`}
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
                  setTitleStyle={i === 0 ? updateTitleStyle : undefined}
                  sizesQueries={`
                          (min-width: ${breakpoints.xlarge}) calc(${breakpoints.xlarge} - 120px),
                          calc(100vw - 84px)
                        `}
                  preCaptionNode={
                    items.length > 1 ? (
                      <Space
                        v={{
                          size: 'm',
                          properties: ['margin-bottom'],
                        }}
                        className={classNames({
                          [font('hnb', 5)]: true,
                        })}
                      >
                        {i + 1} of {items.length}
                      </Space>
                    ) : null
                  }
                />
              </Space>
            ))}

            {titleStyle && (
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
