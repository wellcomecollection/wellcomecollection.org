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
import { trackGaEvent } from '@weco/common/utils/ga';
import CaptionedImage from '../CaptionedImage/CaptionedImage';
import WobblyEdge from '@weco/common/views/components/WobblyEdge/WobblyEdge';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import Control from '@weco/content/components/Buttons/Control/Control';
import Icon from '@weco/common/views/components/Icon/Icon';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import Layout10 from '@weco/common/views/components/Layout10/Layout10';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import Space from '@weco/common/views/components/styled/Space';
import { cross, gallery } from '@weco/common/icons';
import { PageBackgroundContext } from '../ContentPage/ContentPage';
import Tasl from '@weco/common/views/components/Tasl/Tasl';
import ComicPreviousNext, {
  Props as ComicPreviousNextProps,
} from '../ComicPreviousNext/ComicPreviousNext';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { sizes } from '@weco/common/views/themes/config';

function makeSizesForFrames(isThreeUp: boolean) {
  // the frames gallery takes up c. 80% of the width of the screen, so basing
  // image width calculations off 80vw and limiting to 0.8 of the overall
  // grid-width
  if (isThreeUp) {
    return `
        (min-width: ${sizes.medium}px) calc(80vw / 2),
        (min-width: ${sizes.large}px) calc(80vw / 3),
        (min-width: ${sizes.xlarge}px) calc(${sizes.xlarge * 0.8}px / 3),
        calc(100vw - 68px)
      `;
  } else {
    return `
      (min-width: ${sizes.medium}px) calc(80vw / 2),
      (min-width: ${sizes.xlarge}px) calc(${sizes.xlarge * 0.8}px / 2),
      calc(100vw - 68px)
    `;
  }
}

const FrameGridWrap = styled(Space).attrs({
  h: { size: 'l', properties: ['padding-left', 'padding-right'] },
  v: { size: 'xl', properties: ['margin-bottom'] },
})`
  position: relative;

  ${props =>
    props.theme.media('medium')(`
    padding: 0;
  `)}
`;

type FrameGridProps = { isThreeUp: boolean };
const FrameGrid = styled.div<FrameGridProps>`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr;

  ${props =>
    props.theme.media('medium')(`
    grid-template-columns: 1fr 1fr;
  `)}

  ${props =>
    props.theme.media('large')(`
    ${props.isThreeUp && `grid-template-columns: 1fr 1fr 1fr;`}
  `)}
`;

const FrameItem = styled.div`
  width: 100%;
  background: ${props => props.theme.color('white')};
`;

const GalleryTitle = styled(Space).attrs({
  v: { size: 'm', properties: ['margin-bottom'] },
  as: 'span',
  /* TODO: There is no class flex--v-top, what is this mean to do? */
  className: 'flex--v-top',
})`
  display: flex;

  h2 {
    margin-bottom: 0;
  }
`;

type GalleryProps = {
  isActive: boolean;
  isStandalone: boolean;
  pageBackground: 'warmNeutral.300' | 'white';
};
const Gallery = styled.div<GalleryProps>`
  position: relative;

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
      ${props.theme.color('neutral.700')} 100px
    );

    ${props.theme.media('medium')(`
      background: linear-gradient(
        ${props.theme.color(props.pageBackground)} 200px,
        ${props.theme.color('neutral.700')} 200px
      );

      ${
        props.isStandalone && `background: ${props.theme.color('neutral.700')};`
      }
    `)}
  `}

  transition: all 400ms ease;

  ${props =>
    props.isStandalone &&
    `
    background: ${props.theme.color('neutral.700')};

    &::before {
      top: 0;

      ${props.theme.media('medium')`
        top: 0;
      `}
    }
  `}

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

    ${props => props.isActive && `opacity: 0.1;`}

    ${props => props.isStandalone && `top: 0;`}

    ${props =>
      props.theme.media('medium')(`
        top: 200px;
    `)}
  }
`;

const CloseWrapper = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top'],
  },
})`
  position: absolute;
  display: none;

  .enhanced & {
    display: inherit;
    top: 100px;
    bottom: 0;
    width: 100%;
    pointer-events: none;

    ${props => props.theme.media('medium')`
        top: 200px;
      `}
  }
`;

const StandaloneWobblyEdge = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 2;
`;

const WobblyEdgeWrapper = styled.div`
  position: absolute;
  bottom: -2px;
  width: 100%;
`;

type ButtonContainerProps = { isHidden: boolean };
const ButtonContainer = styled.div<ButtonContainerProps>`
  display: ${props => (props.isHidden ? 'none' : 'block')};
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(50%);
  z-index: 2;
`;

type ControlContainerProps = { isActive: boolean };
const ControlContainer = styled(Space).attrs<ControlContainerProps>(props => ({
  v: {
    size: 'm',
    properties: ['padding-bottom'],
  },
  h: { size: 'm', properties: ['padding-right'] },
  className: classNames({
    close: true,
    'is-hidden': !props.isActive,
  }),
}))<ControlContainerProps>`
  display: flex;
  justify-content: flex-end;
`;

export type Props = {
  title?: string;
  items: CaptionedImageProps[];
  isStandalone: boolean;
  isFrames: boolean;
  comicPreviousNext?: ComicPreviousNextProps;
};

const ImageGallery: FunctionComponent<{ id: number } & Props> = ({
  id,
  title,
  items,
  isStandalone,
  isFrames,
  comicPreviousNext,
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

      trackGaEvent({
        category: 'Control',
        action: 'close ImageGallery',
        label: id.toString(),
      });
    }

    if (closeButtonRef.current) {
      closeButtonRef.current.tabIndex = -1;
    }
  }

  function showAllImages(isButton?: boolean) {
    trackGaEvent({
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
            <h2 id={`gallery-${id}`} className={font('wb', 3)} ref={headingRef}>
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
          className="background"
          style={{
            position: 'absolute',
            bottom: 0,
            width: `100%`,
            background: `url(${repeatingLsBlack}) no-repeat top center`,
          }}
        />
        <Layout>
          {comicPreviousNext && <ComicPreviousNext {...comicPreviousNext} />}
          <Space
            v={
              isStandalone || isFrames
                ? { size: 'xl', properties: ['padding-top'] }
                : undefined
            }
            style={{ position: 'relative' }}
          >
            {(isStandalone || isFrames) && (
              <StandaloneWobblyEdge>
                <WobblyEdge isRotated={true} backgroundColor="white" />
              </StandaloneWobblyEdge>
            )}
            {!isActive && (
              <WobblyEdgeWrapper>
                <WobblyEdge backgroundColor={pageBackground} />
              </WobblyEdgeWrapper>
            )}

            {!isStandalone && !isFrames && (
              <CloseWrapper>
                <ControlContainer isActive={isActive}>
                  <Control
                    tabIndex={-1}
                    ariaControls={`image-gallery-${id}`}
                    ariaExpanded={isActive}
                    dataGtmTrigger={'hide_image_gallery'}
                    ref={closeButtonRef}
                    replace={true}
                    colorScheme="light"
                    text="close"
                    icon={cross}
                    clickHandler={handleCloseClicked}
                  />
                </ControlContainer>
              </CloseWrapper>
            )}
            {isFrames && (
              <FrameGridWrap>
                <FrameGrid isThreeUp={isThreeUp}>
                  {itemsToShow().map(captionedImage => (
                    <FrameItem key={captionedImage.image.contentUrl}>
                      <PrismicImage
                        image={captionedImage.image}
                        quality="high"
                        imgSizes={makeSizesForFrames(isThreeUp)}
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
                    hasRoundedCorners={captionedImage.hasRoundedCorners}
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
                  dataGtmTrigger={isActive ? undefined : 'show_image_gallery'}
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
