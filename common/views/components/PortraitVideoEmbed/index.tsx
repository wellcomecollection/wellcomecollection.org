import * as prismic from '@prismicio/client';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { cross, play } from '@weco/common/icons';
import { getConsentState } from '@weco/common/services/app/civic-uk';
import { font } from '@weco/common/utils/classnames';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import Icon from '@weco/common/views/components/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';

export type VideoProvider = 'YouTube' | 'Vimeo';

export type Props = {
  embedUrl: string;
  videoProvider?: VideoProvider;
  posterUrl?: string;
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

const PosterImage = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ControlsOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
`;

const PlayCircle = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${props => props.theme.color('white')};
  color: ${props => props.theme.color('black')};
`;

const DurationText = styled.span.attrs({
  className: font('sans', -1),
})`
  color: ${props => props.theme.color('white')};
`;

const CardTitle = styled.p.attrs({
  className: font('sans', 0),
})`
  margin-top: ${props => props.theme.spacingUnit * 2}px;
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

const TranscriptPanel = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1;
  max-height: 85%;
  overflow-y: auto;
  overscroll-behavior: contain;
  background: ${props => props.theme.color('white')};
  padding: ${props => props.theme.spacingUnit * 2}px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 0;
  background: rgba(0, 0, 0, 0.5);
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
  posterUrl,
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

  const videoSrc = isYouTube
    ? `${embedUrl}&enablejsapi=1&autoplay=1`
    : isVimeo
      ? `${embedUrl}&autoplay=1${!hasAnalyticsConsent ? '&dnt=1' : ''}`
      : undefined;

  return (
    <div data-component="portrait-video-embed">
      <CardButton onClick={openDialog}>
        <div data-chromatic="ignore">
          <PosterContainer>
            {posterUrl && <PosterImage src={posterUrl} alt="" />}
            <ControlsOverlay aria-hidden="true">
              <PlayCircle>
                <Icon icon={play} />
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

      <VideoDialog ref={dialogRef} aria-label={title || 'Video'}>
        <CloseButton onClick={closeDialog} aria-label="Close video" autoFocus>
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
