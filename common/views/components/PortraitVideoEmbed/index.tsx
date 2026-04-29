import * as prismic from '@prismicio/client';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { cross, play } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { getConsentState } from '@weco/common/services/app/civic-uk';
import { font } from '@weco/common/utils/classnames';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import Icon from '@weco/common/views/components/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';

export type VideoProvider = 'YouTube' | 'Vimeo';

export type Props = {
  embedUrl: string;
  videoProvider?: VideoProvider;
  posterImage?: ImageType;
  duration?: string;
  title?: string;
  transcript?: prismic.RichTextField;
};

const CardButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
  text-align: left;
  background: none;

  &:focus-visible {
    outline: 3px solid ${props => props.theme.color('yellow')};
    outline-offset: 3px;
  }
`;

const PosterContainer = styled.div`
  position: relative;
  padding-bottom: 177.78%; /* 9:16 portrait */
  height: 0;
  overflow: hidden;
  background: ${props => props.theme.color('black')};
`;

const PosterImageWrapper = styled.div`
  position: absolute;
  inset: 0;

  img {
    height: 100%;
    object-fit: cover;
  }
`;

const ControlsOverlay = styled(Space).attrs({
  $v: { size: 'xs', properties: ['bottom'] },
  $h: { size: 'xs', properties: ['left'] },
})`
  position: absolute;
  display: flex;
  align-items: center;
  ${props => props.theme.makeSpacePropertyValues('xs', ['column-gap'])};
  padding: 3px 10px 3px 3px;
  background: ${props => props.theme.color('black')};
  border-radius: 9999px;
`;

const PlayCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.color('white')};
  background: ${props => props.theme.color('black')};
  color: ${props => props.theme.color('white')};
`;

const DurationText = styled.span.attrs({
  className: font('sans', -1),
})`
  color: ${props => props.theme.color('white')};
`;

const CardTitle = styled(Space).attrs({
  $v: { size: 'xs', properties: ['margin-top'] },
  as: 'p',
  className: font('sans', 0),
})`
  line-height: 1.6;

  ${CardButton}:hover & {
    text-decoration: underline;
  }
`;

const VideoDialog = styled.dialog`
  padding: 0;
  border: 0;
  background: ${props => props.theme.color('black')};
  width: min(400px, calc(90dvh * 9 / 16), 90vw);
  aspect-ratio: 9 / 16;
  overflow: hidden;
  position: relative;

  &::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }
`;

const TranscriptPanel = styled(Space).attrs({
  $v: { size: 'xs', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'xs', properties: ['padding-left', 'padding-right'] },
})`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  max-height: 85%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: ${props => props.theme.color('white')};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 0;
  cursor: pointer;
  color: ${props => props.theme.color('white')};

  &:focus-visible {
    outline: 3px solid ${props => props.theme.color('yellow')};
    outline-offset: 2px;
  }
`;

const DialogVideoContainer = styled.div`
  position: absolute;
  inset: 0;
`;

const VideoIframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
`;

const PortraitVideoEmbed: FunctionComponent<Props> = ({
  embedUrl,
  videoProvider,
  posterImage,
  duration,
  title,
  transcript,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const id = embedUrl.match(/embed\/(.*?)(?:\?|$)/)?.[1];
  const hasAnalyticsConsent = getConsentState('analytics');
  const isYouTube = videoProvider === 'YouTube';
  const isVimeo = videoProvider === 'Vimeo';

  useEffect(() => {
    if (isYouTube && hasAnalyticsConsent) {
      const scriptId = 'youtube-iframe-api';
      if (document.getElementById(scriptId)) return;

      const s = document.createElement('script');
      s.id = scriptId;
      s.type = 'text/javascript';
      s.async = true;
      s.src = '//www.youtube.com/iframe_api';

      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(s, firstScript);
    }
  }, []);

  // Sync React state when dialog is dismissed by any browser mechanism (e.g. Esc key)
  // so the iframe is unmounted and the video stops playing
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setIsOpen(false);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  const openDialog = () => {
    setIsOpen(true);
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const buildVideoSrc = (): string | undefined => {
    if (!isYouTube && !isVimeo) return undefined;
    const url = new URL(embedUrl);
    url.searchParams.set('autoplay', '1');
    if (isYouTube) {
      url.searchParams.set('enablejsapi', '1');
    } else if (!hasAnalyticsConsent) {
      url.searchParams.set('dnt', '1');
    }
    return url.toString();
  };
  const videoSrc = buildVideoSrc();

  return (
    <div data-component="portrait-video-embed">
      <CardButton type="button" onClick={openDialog}>
        <div data-chromatic="ignore">
          <PosterContainer>
            {posterImage && (
              <PosterImageWrapper>
                <PrismicImage image={posterImage} quality="low" />
              </PosterImageWrapper>
            )}
            <ControlsOverlay aria-hidden="true">
              <PlayCircle>
                <Icon
                  icon={play}
                  sizeOverride="width: 11px; height: 11px; left: 1px;"
                />
              </PlayCircle>
              {duration && <DurationText>{duration}</DurationText>}
            </ControlsOverlay>
          </PosterContainer>

          {title ? (
            <CardTitle>{title}</CardTitle>
          ) : (
            <span className="visually-hidden">Play video</span>
          )}
        </div>
      </CardButton>

      <VideoDialog
        ref={dialogRef}
        aria-label={title || 'Video'}
        onClick={e => e.target === dialogRef.current && closeDialog()}
      >
        <CloseButton
          type="button"
          onClick={closeDialog}
          aria-label="Close video"
          autoFocus
        >
          <Icon icon={cross} iconColor="white" />
        </CloseButton>
        <DialogVideoContainer>
          {isOpen && videoSrc && (
            <VideoIframe
              title={title || 'Video'}
              allowFullScreen={true}
              allow="autoplay; picture-in-picture"
              src={videoSrc}
            />
          )}
        </DialogVideoContainer>
        {!!(transcript?.length && transcript.length > 0) && (
          <TranscriptPanel>
            <CollapsibleContent
              id={`portraitVideoTranscript-${id}`}
              controlText={{
                defaultText: 'Read the transcript',
                contentShowingText: 'Hide the transcript',
              }}
            >
              <PrismicHtmlBlock html={transcript} />
            </CollapsibleContent>
          </TranscriptPanel>
        )}
      </VideoDialog>
    </div>
  );
};

export default PortraitVideoEmbed;
