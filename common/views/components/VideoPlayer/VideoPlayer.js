// @flow
import Router from 'next/router';
import { trackEvent } from '@weco/common/utils/ga';
import { useEffect, useState } from 'react';
import useInterval from '@weco/common/hooks/useInterval';

type Props = {|
  video: {
    '@id': string,
    '@type': 'dctypes:MovingImage',
    format: string,
    label: string,
    metadata: [],
    thumbnail: string,
    rendering: {
      '@id': string,
      format: string,
    }[],
    height: number,
    width: number,
  },
|};

const VideoPlayer = ({ video }: Props) => {
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  function trackViewingTime() {
    trackEvent({
      category: 'Engagement',
      action: `Amount of media played`,
      value: secondsPlayed,
      nonInteraction: true,
      transport: 'beacon',
      label: 'Video',
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
    <video
      onPlay={() => {
        setIsPlaying(true);
        trackEvent({
          category: 'Video',
          action: 'play video',
          label: video['@id'],
        });
      }}
      onPause={() => {
        setIsPlaying(false);
      }}
      controls
      preload="none"
      poster={video.thumbnail}
      style={{
        maxWidth: '100%',
        maxHeight: '260px',
        display: 'block',
      }}
    >
      <source src={video['@id']} type={video.format} />
      {`Sorry, your browser doesn't support embedded video.`}
    </video>
  );
};

export default VideoPlayer;
