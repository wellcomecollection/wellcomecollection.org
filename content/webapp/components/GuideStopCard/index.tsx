import { FunctionComponent } from 'react';
import { getCrop, ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { grid, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { threeUpGridSizesMap } from '@weco/content/components/Body/GridFactory';
import ImagePlaceholder, {
  placeholderBackgroundColor,
} from '@weco/content/components/ImagePlaceholder/ImagePlaceholder';
import { map, duration as durationIcon } from '@weco/common/icons';
import {
  CardOuter,
  CardTitle,
  CardBody,
  CardImageWrapper,
} from '@weco/content/components/Card/Card';

const AlignIconFirstLineCenter = styled.div.attrs({
  className: font('intr', 5),
})`
  display: flex;
  align-items: start;

  .icon {
    height: 1lh;
  }
`;

type Props = {
  link?: string;
  number?: number;
  totalStops: number;
  title: string;
  duration?: string;
  type: 'audio' | 'video';
  image?: ImageType;
};

const GuideStopCard: FunctionComponent<Props> = ({
  link,
  number,
  totalStops,
  title,
  duration,
  type,
  image,
}) => {
  const croppedImage = getCrop(image, '16:9');
  return (
    <Space
      $v={{ size: 'l', properties: ['margin-bottom'] }}
      className={grid(threeUpGridSizesMap.default[0])}
    >
      <CardOuter href={link} style={{ minHeight: '0' }} id={`${number}`}>
        <CardImageWrapper>
          {croppedImage ? (
            <PrismicImage
              // We intentionally omit the alt text on promos, so screen reader
              // users don't have to listen to the alt text before hearing the
              // title of the item in the list.
              image={{ ...croppedImage, alt: '' }}
              sizes={{
                xlarge: 1 / 4,
                large: 1 / 4,
                medium: 1 / 2,
                small: 1,
              }}
              quality="low"
            />
          ) : (
            <div style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
              <ImagePlaceholder
                backgroundColor={placeholderBackgroundColor(number || 1)}
              />
            </div>
          )}
        </CardImageWrapper>
        <CardBody style={{ display: 'block' }}>
          <CardTitle>{title}</CardTitle>
          {number && (
            <AlignIconFirstLineCenter>
              <Space
                style={{ display: 'flex' }}
                $h={{ size: 's', properties: ['margin-right'] }}
              >
                <Icon icon={map} sizeOverride="width: 16px;" />
              </Space>
              <span>
                Stop {number}/{totalStops}
              </span>
            </AlignIconFirstLineCenter>
          )}
          {duration && (
            <AlignIconFirstLineCenter>
              <Space
                style={{ display: 'flex' }}
                $h={{ size: 's', properties: ['margin-right'] }}
              >
                <Icon icon={durationIcon} sizeOverride="width: 16px;" />
              </Space>
              <span className={font('intr', 5)}>
                {duration} minutes {type === 'audio' ? 'listen' : 'watch'} time
              </span>
            </AlignIconFirstLineCenter>
          )}
        </CardBody>
      </CardOuter>
    </Space>
  );
};

export default GuideStopCard;
