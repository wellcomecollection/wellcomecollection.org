import Router from 'next/router';
import { trackEvent } from '@weco/common/utils/ga';
import { useEffect, useState, ReactElement, FunctionComponent } from 'react';
import useInterval from '@weco/common/hooks/useInterval';
import { IIIFMediaElement } from '../../model/iiif';
import MediaAnnotations from '../MediaAnnotations/MediaAnnotations';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  audio: IIIFMediaElement;
};
const AudioPlayer: FunctionComponent<Props> = ({
  audio,
}: Props): ReactElement => {
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function trackViewingTime() {
    trackEvent({
      category: 'Engagement',
      action: `Amount of media played`,
      value: secondsPlayed,
      nonInteraction: true,
      transport: 'beacon',
      label: 'Audio',
    });
  }

  useEffect(() => {
    Router.events.on('routeChangeStart', trackViewingTime);

    try {
      window.addEventListener('beforeunload', trackViewingTime);
    } catch (error) {
      trackEvent({
        category: 'Engagement',
        action: 'unable to track media playing time',
        nonInteraction: true,
      });
    }

    return () => {
      try {
        window.removeEventListener('beforeunload', trackViewingTime);
        Router.events.off('routeChangeStart', trackViewingTime);
      } catch (error) {}
    };
  }, []);

  useInterval(
    () => {
      setSecondsPlayed(secondsPlayed + 1);
    },
    isPlaying ? 1000 : undefined
  );
  const audioPlaceholderThumbnailUrls = [
    'https://iiif.wellcomecollection.org/thumb/b22488522',
    'https://iiif.wellcomecollection.org/thumb/b2248887x',
  ];
  const showThumbnail =
    audio.thumbnail && !audioPlaceholderThumbnailUrls.includes(audio.thumbnail);

  return (
    <div>
      {showThumbnail && (
        <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
          <img src={audio.thumbnail} alt={audio.label} />
        </Space>
      )}
      <audio
        onPlay={() => {
          setIsPlaying(true);

          trackEvent({
            category: 'Audio',
            action: 'play audio',
            label: audio['@id'],
          });
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        controls
        src={audio['@id']}
      >
        {`Sorry, your browser doesn't support embedded audio.`}
      </audio>
      <MediaAnnotations media={audio} />
    </div>
  );
};

export default AudioPlayer;
