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
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Space from '@weco/common/views/components/styled/Space';
import { cross, gallery } from '@weco/common/icons';
import { PageBackgroundContext } from '../ContentPage/ContentPage';
import HeightRestrictedPrismicImage from '@weco/common/views/components/HeightRestrictedPrismicImage/HeightRestrictedPrismicImage';
import Tasl from '@weco/common/views/components/Tasl/Tasl';

const FrameGridWrap = styled(Space).attrs({
  v: { size: 'xl', properties: ['margin-bottom'] },
})`
  position: relative;
`;

const FrameGrid = styled.div<{ isThreeUp: boolean }>`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;

  ${props => props.theme.media.medium`
    grid-template-columns: 1fr 1fr;
  `}

  ${props =>
    props.theme.media.large`

    ${
      props.isThreeUp &&
      `
      grid-template-columns: 1fr 1fr 1fr;
    `
    }
  `}
`;

const FrameItem = styled.div`
  width: 100%;
  background: ${props => props.theme.color('white')};
`;

const GalleryTitle = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
  as: 'span',
  className: 'flex flex--v-top',
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
  isFrames: boolean;
};

const ImageGallery: FunctionComponent<{ id: number } & Props> = ({
  id,
  title,
  items,
  isStandalone,
  isFrames,
}) => {
  const [isActive, setIsActive] = useState(true);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const pageBackground = useContext(PageBackgroundContext);

  useEffect(() => {
    !isStandalone && !isFrames && setIsActive(false);
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

  const itemsToShow = () => (isActive ? items : [items[0]]);
  const isThreeUp = itemsToShow().length % 3 === 0;

  const Layout = ({ children }) => {
    if (isFrames && isThreeUp) {
      // More landscape so allow more horizontal space
      return <Layout10>{children}</Layout10>;
    } else if (isFrames && !isThreeUp) {
      // More square/portrait so limit horizontal space
      return <Layout8>{children}</Layout8>;
    } else {
      // Not in frames, so image width/height constraint happens on the single image
      return <Layout12>{children}</Layout12>;
    }
  };

  return (
    <>
      {!isStandalone && !isFrames && (
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
        isStandalone={isStandalone || isFrames}
        id={`image-gallery-${id}`}
        pageBackground={pageBackground}
      >
        <div
          className="absolute background"
          style={{
            bottom: 0,
            width: `100%`,
            background: `url(${repeatingLsBlack}) no-repeat top center`,
          }}
        />
        <Layout>
          <Space
            v={
              isStandalone || isFrames
                ? {
                    size: 'xl',
                    properties: ['padding-top'],
                  }
                : undefined
            }
            className="relative"
          >
            {(isStandalone || isFrames) && (
              <div className="absolute standalone-wobbly-edge">
                <WobblyEdge isRotated={true} background="white" />
              </div>
            )}
            {!isActive && (
              <div className="wobbly-edge-wrapper absolute">
                <WobblyEdge background={pageBackground} />
              </div>
            )}

            {!isStandalone && !isFrames && (
              <Space
                v={{
                  size: 'm',
                  properties: ['padding-top'],
                }}
                className="close-wrapper absolute"
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
            {isFrames && (
              <FrameGridWrap>
                <FrameGrid isThreeUp={isThreeUp}>
                  {itemsToShow().map(captionedImage => (
                    <FrameItem key={captionedImage.image.contentUrl}>
                      <HeightRestrictedPrismicImage
                        image={captionedImage.image}
                        quality="high"
                      />
                    </FrameItem>
                  ))}
                </FrameGrid>
                <Tasl {...itemsToShow()[0].image.tasl} />
              </FrameGridWrap>
            )}
            {!isFrames &&
              itemsToShow().map((captionedImage, i) => (
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
                          className={font('intb', 5)}
                        >
                          {i + 1} of {items.length}
                        </Space>
                      ) : null
                    }
                  />
                </Space>
              ))}

            {!isStandalone && !isFrames && (
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
        </Layout>
      </Gallery>
    </>
  );
};

export default ImageGallery;
