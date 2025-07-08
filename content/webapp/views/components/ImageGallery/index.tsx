import { FunctionComponent, useEffect, useRef, useState } from 'react';

import { cross, gallery } from '@weco/common/icons';
import { CaptionedImage as CaptionedImageProps } from '@weco/common/model/captioned-image';
import { repeatingLsBlack } from '@weco/common/utils/backgrounds';
import { font } from '@weco/common/utils/classnames';
import { dasherize, pluralize } from '@weco/common/utils/grammar';
import Button from '@weco/common/views/components/Buttons';
import Control from '@weco/common/views/components/Control';
import Icon from '@weco/common/views/components/Icon';
import {
  ContaineredLayout,
  gridSize10,
  gridSize12,
  gridSize8,
} from '@weco/common/views/components/Layout';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';
import Tasl from '@weco/common/views/components/Tasl';
import { WobblyEdge } from '@weco/common/views/components/WobblyEdge';
import { sizes } from '@weco/common/views/themes/config';
import CaptionedImage from '@weco/content/views/components/CaptionedImage';
import ComicPreviousNext, {
  Props as ComicPreviousNextProps,
} from '@weco/content/views/components/ComicPreviousNext';
import { useContentPageContext } from '@weco/content/contexts/ContentPageContext';

import {
  ButtonContainer,
  CloseWrapper,
  ControlContainer,
  FrameGrid,
  FrameGridWrap,
  FrameItem,
  Gallery,
  GalleryTitle,
  StandaloneWobblyEdge,
  WobblyEdgeWrapper,
} from './ImageGallery.styles';

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

export type Props = {
  title?: string;
  items: CaptionedImageProps[];
  isStandalone: boolean;
  isFrames: boolean;
  comicPreviousNext?: ComicPreviousNextProps;
};

const ImageGallery: FunctionComponent<{ id: string } & Props> = ({
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
  const { pageBackgroundColor } = useContentPageContext();

  useEffect(() => {
    !isStandalone && !isFrames && setIsActive(false);
  }, []);

  function handleOpenClicked() {
    if (closeButtonRef.current) {
      closeButtonRef.current.tabIndex = 0;
      closeButtonRef.current.focus();
      setIsActive(true);
    }

    if (openButtonRef.current) {
      openButtonRef.current.tabIndex = -1;
    }
  }

  function handleCloseClicked() {
    if (openButtonRef.current) {
      openButtonRef.current.tabIndex = 0;
      openButtonRef.current.focus();
      setIsActive(false);

      if (headingRef.current) {
        headingRef.current.scrollIntoView();
      }
    }

    if (closeButtonRef.current) {
      closeButtonRef.current.tabIndex = -1;
    }
  }

  const itemsToShow = () => (isActive ? items : [items[0]]);
  const isThreeUp = itemsToShow().length % 3 === 0;

  const getGridSize = () => {
    if (isFrames && isThreeUp) {
      // More landscape so allow more horizontal space
      return gridSize10();
    } else if (isFrames && !isThreeUp) {
      // More square/portrait so limit horizontal space
      return gridSize8();
    } else {
      // Not in frames, so image width/height constraint happens on the single image
      return gridSize12();
    }
  };

  return (
    <>
      {!isStandalone && !isFrames && (
        <ContaineredLayout gridSizes={gridSize8()}>
          <GalleryTitle>
            <Space as="span" $h={{ size: 's', properties: ['margin-right'] }}>
              <Icon icon={gallery} />
            </Space>
            <h2
              id={title ? dasherize(title) : `gallery-${id}`}
              className={font('wb', 3)}
              ref={headingRef}
            >
              {title || 'In pictures'}
            </h2>
          </GalleryTitle>
        </ContaineredLayout>
      )}
      <Gallery
        id={id}
        $isActive={isActive}
        $isStandalone={isStandalone || isFrames}
        $pageBackground={pageBackgroundColor}
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
        <ContaineredLayout gridSizes={getGridSize()}>
          {comicPreviousNext && <ComicPreviousNext {...comicPreviousNext} />}
          <Space
            $v={
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
                <WobblyEdge backgroundColor={pageBackgroundColor} />
              </WobblyEdgeWrapper>
            )}

            {!isStandalone && !isFrames && (
              <CloseWrapper>
                <ControlContainer $isActive={isActive}>
                  <Control
                    tabIndex={-1}
                    ariaControls={id}
                    ariaExpanded={isActive}
                    dataGtmTrigger="hide_image_gallery"
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
                <FrameGrid $isThreeUp={isThreeUp}>
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
                  $v={
                    isActive
                      ? { size: 'xl', properties: ['margin-bottom'] }
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
                          $v={{ size: 'm', properties: ['margin-bottom'] }}
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
              <ButtonContainer $isHidden={isActive}>
                <Button
                  variant="ButtonSolid"
                  ref={openButtonRef}
                  ariaControls={id}
                  ariaExpanded={isActive}
                  dataGtmTrigger={isActive ? undefined : 'show_image_gallery'}
                  icon={gallery}
                  clickHandler={handleOpenClicked}
                  text={pluralize(items.length, 'image')}
                />
              </ButtonContainer>
            )}
          </Space>
        </ContaineredLayout>
      </Gallery>
    </>
  );
};

export default ImageGallery;
