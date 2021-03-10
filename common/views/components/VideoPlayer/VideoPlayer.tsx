import Router from 'next/router';
import { trackEvent } from '@weco/common/utils/ga';
import { FunctionComponent, useEffect, useState } from 'react';
import useInterval from '@weco/common/hooks/useInterval';
import { IIIFMediaElement } from '@weco/common/model/iiif';
import {
  getAnnotationFromMediaElement,
  getVideoClickthroughService,
  getTokenService,
} from '@weco/common/utils/iiif';
import Space from '@weco/common/views/components/styled/Space';
import DownloadLink from '@weco/catalogue/components/DownloadLink/DownloadLink';
import IIIFClickthrough from '@weco/common/views/components/IIIFClickthrough/IIIFClickthrough';

type Props = {
  video: IIIFMediaElement;
  showDownloadOptions: boolean;
};

const VideoPlayer: FunctionComponent<Props> = ({
  video,
  showDownloadOptions,
}: Props) => {
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const annotation: any = getAnnotationFromMediaElement(video);
  const authService = video && getVideoClickthroughService(video);
  const tokenService = authService && getTokenService(authService);

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
    <IIIFClickthrough authService={authService} tokenService={tokenService}>
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
        <source src={video['@id']} type={video.format} />
        {`Sorry, your browser doesn't support embedded video.`}
      </video>
      {annotation &&
        annotation.resource &&
        annotation.resource.format === 'application/pdf' && (
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <DownloadLink
              href={annotation.resource['@id']}
              linkText={`Transcript of ${annotation.resource.label} video`}
              format={'PDF'}
              trackingEvent={{
                category: 'Download link',
                action: 'follow video annotation link',
                label: video['@id'],
              }}
              mimeType={annotation.resource.format}
              trackingTags={['annotation']}
            />
          </Space>
        )}
    </IIIFClickthrough>
  );
};

export default VideoPlayer;
