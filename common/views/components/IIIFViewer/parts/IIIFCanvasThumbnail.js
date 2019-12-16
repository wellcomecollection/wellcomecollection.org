// @flow
import { type IIIFCanvas } from '@weco/common/model/iiif';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { lighten } from 'polished';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import LL from '@weco/common/views/components/styled/LL';

const IIIFViewerThumb = styled.button.attrs(props => ({
  tabIndex: props.isFocusable ? 0 : -1,
}))`
  appearance: none;
  font-family: inherit;
  letter-spacing: inherit;
  cursor: pointer;
  border: 0;
  display: block;
  height: 100%;
  width: 130px;
  max-width: 90%;
  border-radius: 8px;
  background: ${props =>
    props.isActive
      ? lighten(0.14, props.theme.colors.viewerBlack)
      : props.theme.colors.viewerBlack};
  padding: 12px 16px;
  text-align: center;
  margin: auto;
`;

const IIIFViewerThumbInner = styled.span`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const ImageContainer = styled.div`
  flex-grow: 1;
  position: relative;
  img {
    position: absolute;
    top: 0;
    left: 0;
    max-height: 100%;
    max-width: 100%;
    height: auto;
    width: auto;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const IIIFViewerThumbNumber = styled.span.attrs(props => ({
  className: classNames({
    'line-height-1': true,
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
  isActive: boolean,
  thumbNumber: number,
  clickHandler?: () => void,
  isFocusable?: boolean,
|};

const IIIFCanvasThumbnail = ({
  canvas,
  lang,
  clickHandler,
  isActive,
  thumbNumber,
  isFocusable,
}: IIIFCanvasThumbnailProps) => {
  const thumbnailService = canvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions = thumbnailService.sizes
    .sort((a, b) => a.width - b.width)
    .find(dimensions => dimensions.width > 100);
  return (
    <IIIFViewerThumb
      onClick={clickHandler}
      isActive={isActive}
      isFocusable={isFocusable}
    >
      <IIIFViewerThumbInner>
        <ImageContainer>
          <LL small={true} lighten={true} />
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
            isLazy={false}
          />
        </ImageContainer>
        <div>
          <IIIFViewerThumbNumber isActive={isActive}>
            <span className="visually-hidden">image </span>
            {thumbNumber}
          </IIIFViewerThumbNumber>
        </div>
      </IIIFViewerThumbInner>
    </IIIFViewerThumb>
  );
};

export default IIIFCanvasThumbnail;
