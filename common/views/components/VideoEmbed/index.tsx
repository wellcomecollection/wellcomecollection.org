import * as prismic from '@prismicio/client';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { getConsentState } from '@weco/common/services/app/civic-uk';
import Caption from '@weco/common/views/components/Caption';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import { IframeContainer } from '@weco/common/views/components/Iframe';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';

export type VideoProvider = 'YouTube' | 'Vimeo';

export type Props = {
  embedUrl: string;
  videoProvider?: VideoProvider;
  videoThumbnail?: string;
  caption?: prismic.RichTextField;
  transcript?: prismic.RichTextField;
  hasFullSizePoster?: boolean;
};

// In order to have a red button with a white triangle, we can't reuse the
// YouTube icon we have in the icon set, so keeping this player button as its
// own svg in this file.
const YouTubePlay = () => (
  <svg height="100%" version="1.1" viewBox="0 0 68 48" width="100%">
    <path
      d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
      fill="#f00"
    ></path>
    <path d="M 45,24 27,14 27,34" fill="#fff"></path>
  </svg>
);

const VideoEmbedWrapper = styled.figure`
  margin: 0;
`;

const VideoTrigger = styled.button<{ $hasFullSizePoster?: boolean }>`
  position: absolute;
  padding-bottom: 56.25%; /* 16:9 */
  width: 100%;

  img {
    top: ${props => (props.$hasFullSizePoster ? 0 : '-16.84%')};
    left: 0;
    position: absolute;
  }

  svg {
    position: absolute;
    width: 68px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1;
  }

  &:focus {
    border: 3px solid ${props => props.theme.color('yellow')};
  }
`;

const VideoEmbed: FunctionComponent<Props> = ({
  embedUrl,
  videoProvider,
  videoThumbnail,
  caption,
  transcript,
  hasFullSizePoster,
}: Props) => {
  const [isActive, setIsActive] = useState(false);
  const id = embedUrl.match(/embed\/(.*)\?/)?.[1];
  const hasAnalyticsConsent = getConsentState('analytics');
  const isYouTube = videoProvider === 'YouTube';
  const isVimeo = videoProvider === 'Vimeo';

  useEffect(() => {
    if (isYouTube && hasAnalyticsConsent) {
      // GA4 automatically tracks YouTube engagement, but requires the iframe api
      // script to have been loaded on the page. Since we're lazyloading youtube
      // videos, we have to add the script ourselves (and check that we haven't
      // done so already). The following is a version of 'option 3' from this article:
      // https://www.analyticsmania.com/post/youtube-tracking-google-tag-manager-solved/
      const scriptId = 'youtube-iframe-api';
      const youtubeIframeApi = document.getElementById(scriptId);

      if (youtubeIframeApi) return;

      const s = document.createElement('script');
      s.id = scriptId;
      s.type = 'text/javascript';
      s.async = true;
      s.src = '//www.youtube.com/iframe_api';

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(s, firstScript);
    }
  }, []);

  const videoSrc = isYouTube
    ? `${embedUrl}&enablejsapi=1&autoplay=1`
    : isVimeo
      ? `${embedUrl}&autoplay=1${!hasAnalyticsConsent ? '&dnt=1' : ''}`
      : undefined;

  const thumbnailSrc = isYouTube
    ? `https://img.youtube.com/vi/${id}/${
        hasFullSizePoster ? 'maxresdefault' : 'hqdefault'
      }.jpg`
    : isVimeo
      ? videoThumbnail
      : undefined;

  return (
    <>
      <VideoEmbedWrapper data-chromatic="ignore">
        <IframeContainer>
          {isActive && videoSrc ? (
            <iframe
              className="iframe"
              title="Video"
              allowFullScreen={true}
              allow="autoplay; picture-in-picture"
              src={videoSrc}
              style={{ border: 0 }}
            />
          ) : (
            <VideoTrigger
              onClick={() => setIsActive(true)}
              $hasFullSizePoster={hasFullSizePoster || isVimeo}
            >
              <span className="visually-hidden">Play video</span>
              {isYouTube && <YouTubePlay />}
              {thumbnailSrc && <img src={thumbnailSrc} alt="" />}
            </VideoTrigger>
          )}
        </IframeContainer>

        {caption && <Caption caption={caption} />}
      </VideoEmbedWrapper>

      {!!(transcript?.length && transcript.length > 0) && (
        <CollapsibleContent
          id={`embedVideoTranscript-${id}`}
          controlText={{
            defaultText: 'Read the transcript',
            contentShowingText: 'Hide the transcript',
          }}
        >
          <PrismicHtmlBlock html={transcript} />
        </CollapsibleContent>
      )}
    </>
  );
};

export default VideoEmbed;
