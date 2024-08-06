import { FunctionComponent } from 'react';
import { getCrop, ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { grid } from '@weco/common/utils/classnames';
import { threeUpGridSizesMap } from '@weco/content/components/Body/GridFactory';

import {
  map,
  audio as audioIcon,
  video as videoIcon,
} from '@weco/common/icons';
import {
  CardOuter,
  CardTitle,
  CardBody,
  CardImageWrapper,
} from '@weco/content/components/Card/Card';

function secondsToMinutesAndSeconds(s: number): string {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  const padSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const padMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${padMinutes}:${padSeconds}`;
}

type Props = {
  link?: string;
  number?: number;
  totalStops: number;
  title: string;
  duration?: number;
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
  const durationInSeconds = duration && Math.round(duration * 60);
  const durationInMinutesAndSeconds = durationInSeconds
    ? secondsToMinutesAndSeconds(durationInSeconds)
    : undefined;
  const croppedImage = getCrop(image, '16:9');

  return (
    <Space
      $v={{ size: 'l', properties: ['margin-bottom'] }}
      className={grid(threeUpGridSizesMap.default[0])}
    >
      <CardOuter href={link} style={{ minHeight: '0' }}>
        <CardImageWrapper>
          {croppedImage && (
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
          )}
        </CardImageWrapper>
        <CardBody style={{ display: 'block' }}>
          <CardTitle>{title}</CardTitle>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {number && (
              <>
                <Space
                  style={{ display: 'flex' }}
                  $h={{ size: 's', properties: ['margin-right'] }}
                >
                  <Icon icon={map} matchText={true} />
                </Space>
                <span>
                  Stop {number}/{totalStops}
                </span>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Space
              style={{ display: 'flex' }}
              $h={{ size: 's', properties: ['margin-right'] }}
            >
              <Icon
                icon={type === 'video' ? videoIcon : audioIcon}
                matchText={true}
              />
            </Space>
            {durationInMinutesAndSeconds && (
              <span>Duration {durationInMinutesAndSeconds} minutes</span>
            )}
          </div>
        </CardBody>
      </CardOuter>
    </Space>
  );
};

export default GuideStopCard;
