import Router from 'next/router';
import { trackGaEvent } from '@weco/common/utils/ga';
import { FunctionComponent, useEffect, useState, useRef } from 'react';
import useInterval from '@weco/common/hooks/useInterval';
import MediaAnnotations from '../MediaAnnotations/MediaAnnotations';
import { Video } from '../../services/iiif/types/manifest/v3';

type Props = {
  video: Video;
  showDownloadOptions: boolean;
};

const VideoPlayer: FunctionComponent<Props> = ({
  video,
  showDownloadOptions,
}: Props) => {
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const secondsPlayedRef = useRef(secondsPlayed);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    secondsPlayedRef.current = secondsPlayed;
  }, [secondsPlayed]);

  function trackViewingTime() {
    trackGaEvent({
      category: 'Engagement',
      action: 'Amount of media played',
      value: secondsPlayedRef.current,
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
      trackGaEvent({
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

  return (
    <>
      <video
        onPlay={() => {
          setIsPlaying(true);
          trackGaEvent({
            category: 'Video',
            action: 'play video',
            label: video.id,
          });
        }}
        onPause={() => {
          setIsPlaying(false);
        }}
        controlsList={!showDownloadOptions ? 'nodownload' : undefined}
        controls
        preload="none"
        poster={video.thumbnail}
        style={{
          maxWidth: '100%',
          maxHeight: '260px',
          display: 'inline-block',
        }}
      >
        <source src={video.id} type={video.format} />
        {`Sorry, your browser doesn't support embedded video.`}
      </video>
      <MediaAnnotations media={video} />
    </>
  );
};

export default VideoPlayer;
