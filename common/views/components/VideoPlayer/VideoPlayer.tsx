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
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import useShowClickthrough from '@weco/common/hooks/useShowClickthrough';

// TODO make own thing and share
const IframeAuthMessage = styled.iframe`
  display: none;
`;
const iframeId = 'authMessage';
function reloadAuthIframe(document, id: string) {
  const authMessageIframe: HTMLIFrameElement = document.getElementById(id);
  // assigning the iframe src to itself reloads the iframe and refires the window.message event
  // eslint-disable-next-line no-self-assign
  authMessageIframe.src = authMessageIframe.src;
}

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
  const showClickthrough = useShowClickthrough(authService, tokenService);

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
      {tokenService && origin && (
        <IframeAuthMessage
          id={iframeId}
          src={`${tokenService['@id']}?messageId=1&origin=${origin}`}
        />
      )}
      {showClickthrough ? (
        <div className={font('hnl', 5)}>
          {authService?.label && (
            <h2 className={font('hnm', 4)}>{authService?.label}</h2>
          )}
          {authService?.description && (
            <p
              dangerouslySetInnerHTML={{
                __html: authService?.description,
              }}
            />
          )}
          {authService?.['@id'] && origin && (
            <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
              <ButtonSolid
                text="Show the content"
                clickHandler={() => {
                  trackEvent({
                    category: 'ButtonSolidLink',
                    action: 'follow link "Show the content"',
                    label: `workId: `, // TODO work id
                  });
                  const authServiceWindow = window.open(
                    `${authService?.['@id'] || ''}?origin=${origin}`
                  );
                  authServiceWindow &&
                    authServiceWindow.addEventListener('unload', function() {
                      reloadAuthIframe(document, iframeId);
                    });
                }}
              />
            </Space>
          )}
        </div>
      ) : (
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
        </>
      )}
    </>
  );
};

export default VideoPlayer;
