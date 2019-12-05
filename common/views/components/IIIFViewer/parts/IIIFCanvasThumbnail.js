import { iiifImageTemplate } from '@weco/common/utils/convert-image-uri';
import IIIFResponsiveImage from '@weco/common/views/components/IIIFResponsiveImage/IIIFResponsiveImage';
import LL from '@weco/common/views/components/styled/LL';

type IIIFCanvasThumbnailProps = {|
  canvas: IIIFCanvas,
  lang: string,
  isEnhanced: boolean,
|};

const IIIFCanvasThumbnail = ({
  canvas,
  lang,
  isEnhanced,
}: IIIFCanvasThumbnailProps) => {
  const thumbnailService = canvas.thumbnail.service;
  const urlTemplate = iiifImageTemplate(thumbnailService['@id']);
  const smallestWidthImageDimensions = thumbnailService.sizes
    .sort((a, b) => a.width - b.width)
    .find(dimensions => dimensions.width > 100);
  return (
    <>
      {isEnhanced ? (
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
              isLazy={true}
            />
          </div>
        </div>
      ) : (
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
      )}
    </>
  );
};

export default IIIFCanvasThumbnail;
