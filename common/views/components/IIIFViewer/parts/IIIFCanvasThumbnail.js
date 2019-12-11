// @flow
import { type IIIFCanvas } from '@weco/common/model/iiif';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { lighten } from 'polished';
import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import LL from '@weco/common/views/components/styled/LL';

// TODO tidy up styles - all styled components needed?
const IIIFViewerThumb = styled.div`
  width: 130px;
  margin: 3%;
  border-radius: 8px;
  background: ${props =>
    props.isActive
      ? lighten(0.14, props.theme.colors.viewerBlack)
      : props.theme.colors.viewerBlack};

  img {
    display: block;
    width: 100%;
  }

  noscript & {
    height: 100%;
    @media (min-width: ${props => props.theme.sizes.medium}px) {
      width: auto;
    }
    img {
      display: inline-block;
      max-height: calc(100% - 2em);
    }
  }
`;

const IIIFViewerThumbLink = styled.div.attrs(props => ({
  className: classNames({
    'block h-center': true,
  }),
}))`
  text-decoration: none;
  height: 100%;
  text-align: center;
  display: block;
  padding: 16px 16px 3px;
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
    <IIIFViewerThumb>
      <IIIFViewerThumbLink onClick={clickHandler}>
        <div
          style={{
            // TODO make into a styled component
            position: 'relative',
            paddingTop: smallestWidthImageDimensions
              ? `${(smallestWidthImageDimensions.height /
                  smallestWidthImageDimensions.width) *
                  100}%`
              : 0,
          }}
        >
          <LL small={true} lighten={true} />
          <div
            style={{
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
            }}
          >
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
          </div>
        </div>
        <div>
          <IIIFViewerThumbNumber isActive={isActive}>
            <span className="visually-hidden">image </span>
            {thumbNumber}
          </IIIFViewerThumbNumber>
        </div>
      </IIIFViewerThumbLink>
    </IIIFViewerThumb>
  );
};

export default IIIFCanvasThumbnail;
