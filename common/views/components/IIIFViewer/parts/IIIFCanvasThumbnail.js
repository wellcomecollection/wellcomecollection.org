// @flow
import { type IIIFCanvas } from '@weco/common/model/iiif';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { lighten } from 'polished';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import LL from '@weco/common/views/components/styled/LL';

const IIIFViewerThumb = styled.div`
  max-height: 200px;
  max-width: 130px;
  height: calc(100%);
  margin: 0 auto;
  border-radius: 8px;
  background: ${props =>
    props.isActive
      ? lighten(0.14, props.theme.colors.viewerBlack)
      : props.theme.colors.viewerBlack};
  padding: 0 16px 0px;

  text-align: center;
  img {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    transform: ;
    max-height: 100%;
    max-width: 100%;
    width: auto;
  }
`;

const LLContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const ImageContainer = styled.div`
  flex-grow: 1;
  position: relative;
  min-height: 100px;
  overflow: hidden;
`;

const IIIFViewerThumbNumber = styled.span.attrs(props => ({
  className: classNames({
    'line-height-1': true,
    'inline-block': true,
    'font-white': !props.isActive,
    'font-black': props.isActive,
    'bg-yellow': props.isActive,
    [font('hnm', 6)]: true,
  }),
}))`
  padding: 3px 6px;
  border-radius: 3px;
`;

type IIIFCanvasThumbnailProps = {|
  canvas: IIIFCanvas,
  lang: string,
  isLazy: boolean,
  isActive: boolean,
  thumbNumber: number,
  clickHandler?: () => void,
|};

const IIIFCanvasThumbnail = ({
  canvas,
  lang,
  isLazy,
  clickHandler,
  isActive,
  thumbNumber,
}: IIIFCanvasThumbnailProps) => {
  const thumbnailService = canvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions = thumbnailService.sizes
    .sort((a, b) => a.width - b.width)
    .find(dimensions => dimensions.width > 100);
  return (
    <IIIFViewerThumb onClick={clickHandler} isActive={isActive}>
      <LLContainer>
        <LL small={true} lighten={true} />
      </LLContainer>
      <ImageContainer>
        <IIIFResponsiveImage
          width={
            smallestWidthImageDimensions
              ? smallestWidthImageDimensions.width
              : 30
          }
          src={urlTemplate({
            size: `${
              smallestWidthImageDimensions
                ? smallestWidthImageDimensions.width
                : '!100'
            },`,
          })}
          srcSet={''}
          sizes={`${
            smallestWidthImageDimensions
              ? smallestWidthImageDimensions.width
              : 30
          }px`}
          alt={''}
          lang={lang}
          isLazy={isLazy}
        />
      </ImageContainer>
      <IIIFViewerThumbNumber isActive={isActive}>
        <span className="visually-hidden">image </span>
        {thumbNumber}
      </IIIFViewerThumbNumber>
    </IIIFViewerThumb>
  );
};

export default IIIFCanvasThumbnail;
