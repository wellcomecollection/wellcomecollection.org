// @flow
import Router from 'next/router';
import { trackEvent } from '@weco/common/utils/ga';
import { useEffect, useState } from 'react';
import useInterval from '@weco/common/hooks/useInterval';
import { type IIIFMediaElement } from '@weco/common/model/iiif';
import { getAnnotationFromMediaElement } from '@weco/common/utils/iiif';
import Icon from '@weco/common/views/components/Icon/Icon';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { DownloadLink } from '@weco/catalogue/components/Download/Download';

type Props = {|
  video: IIIFMediaElement,
|};

const VideoPlayer = ({ video }: Props) => {
  const [secondsPlayed, setSecondsPlayed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const annotation = getAnnotationFromMediaElement(video);
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
    <>
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
      {annotation &&
        annotation.resource &&
        annotation.resource.format === 'application/pdf' && (
          <Space v={{ size: 's', properties: ['margin-top'] }}>
            <DownloadLink
              target="_blank"
              rel="noopener noreferrer"
              href={annotation.resource['@id']}
              onClick={() => {
                trackEvent({
                  category: 'Download link',
                  action: 'follow video annotation link',
                  label: video['@id'],
                });
              }}
            >
              <span className="flex-inline flex--v-center">
                <Icon name="download" />
                <span className="underline-on-hover">
                  {`Transcript of ${annotation.resource.label} video`}
                </span>
                <Space
                  as="span"
                  h={{ size: 'm', properties: ['margin-left'] }}
                  className={classNames({
                    [font('hnm', 5)]: true,
                    'font-pewter': true,
                  })}
                >
                  PDF
                </Space>
              </span>
            </DownloadLink>
          </Space>
        )}
    </>
  );
};

export default VideoPlayer;
