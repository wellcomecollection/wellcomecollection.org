import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { getCrop, ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import Icon from '@weco/common/views/components/Icon/Icon';
import Space from '@weco/common/views/components/styled/Space';
import { map, audio, video } from '@weco/common/icons';
import {
  CardOuter,
  CardTitle,
  CardBody,
} from '@weco/content/components/Card/Card';
export const CardImageWrapper = styled.div`
  position: relative;
`;
type AudioVideoStop = {
  type: 'audio' | 'video';
  link: string;
  image: ImageType;
  title: string;
  duration: number;
  stopNumber: number;
  totalStops: number;
};

type Props = {
  stop: AudioVideoStop;
};

function secondsToMinutesAndSeconds(s: number): string {
  const minutes = Math.floor(s / 60);
  const seconds = s % 60;
  const padSeconds = seconds < 10 ? `0${seconds}` : seconds;
  const padMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${padMinutes}:${padSeconds}`;
}

const AudioVideoCard: FunctionComponent<Props> = ({ stop }: Props) => {
  const durationInMinutes = secondsToMinutesAndSeconds(stop.duration);
  const image = getCrop(stop.image, '16:9');

  return (
    // TODO: do minHeight with a prop?
    <CardOuter href={stop.link} style={{ minHeight: '0' }}>
      <CardImageWrapper>
        {image && (
          <PrismicImage
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            image={{ ...image, alt: '' }}
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
      {/* TODO: not sure if display: block is right here */}
      <CardBody style={{ display: 'block' }}>
        <CardTitle>{stop.title}</CardTitle>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space
            style={{ display: 'flex' }}
            $h={{ size: 's', properties: ['margin-right'] }}
          >
            <Icon icon={map} matchText={true} />
          </Space>
          <span>
            Stop {stop.stopNumber}/{stop.totalStops}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Space
            style={{ display: 'flex' }}
            $h={{ size: 's', properties: ['margin-right'] }}
          >
            <Icon
              icon={stop.type === 'audio' ? audio : video}
              matchText={true}
            />
          </Space>
          <span>Duration {durationInMinutes} minutes</span>
        </div>
      </CardBody>
    </CardOuter>
  );
};

export default AudioVideoCard;
