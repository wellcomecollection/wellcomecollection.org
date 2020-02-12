// @flow
import Router from 'next/router';
import { trackEvent } from '@weco/common/utils/ga';
import { useEffect, useState } from 'react';
import useInterval from '@weco/common/hooks/useInterval';

type Props = {|
  audio: {
    '@id': string,
    '@type': 'dctypes:Sound',
    format: string,
    label: string,
    metadata: [],
    thumbnail: string,
    rendering: {
      '@id': string,
      format: string,
    },
  },
|};

const AudioPlayer = ({ audio }: Props) => {
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
    isPlaying ? 1000 : null
  );
  return (
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
  );
};

export default AudioPlayer;
