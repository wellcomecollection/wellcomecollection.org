import * as prismic from '@prismicio/client';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import useVideoEmbed, { VideoProvider } from '@weco/common/hooks/useVideoEmbed';
import { cross, play } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import {
  CaptionsButton,
  DialogButton,
  DialogControls,
  DialogVideoContainer,
  NavGroup,
  TranscriptOverlay,
  VideoDialog,
  VideoIframe,
} from '@weco/common/views/components/PortraitVideoEmbed/PortraitVideoDialog.styles';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Space from '@weco/common/views/components/styled/Space';

export type { VideoProvider };

export type Props = {
  embedUrl: string;
  videoProvider?: VideoProvider;
  posterImage?: ImageType;
  duration?: string;
  title?: string;
  transcript?: prismic.RichTextField;
  /** When provided, the card triggers this callback and renders no dialog.
   *  The caller is responsible for showing the video. */
  onOpen?: () => void;
};

const CardButton = styled.button`
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  cursor: pointer;
  text-align: left;
  background: none;
`;

const PosterContainer = styled.span`
  display: block;
  position: relative;
  padding-bottom: 177.78%; /* 9:16 portrait */
  height: 0;
  overflow: hidden;
  background: ${props => props.theme.color('black')};
`;

const PosterImageWrapper = styled.span`
  display: block;
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
  as: 'span',
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
  as: 'span',
  className: font('sans', 0),
})`
  display: block;
  line-height: 1.6;

  ${CardButton}:hover & {
    text-decoration: underline;
  }
`;

const PortraitVideoEmbed: FunctionComponent<Props> = ({
  embedUrl,
  videoProvider,
  posterImage,
  duration,
  title,
  transcript,
  onOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { videoSrc, uid } = useVideoEmbed(embedUrl, videoProvider);
  const hasTranscript = !!(transcript?.length && transcript.length > 0);

  // Sync React state when dialog is dismissed by any browser mechanism (e.g. Esc key)
  // so the iframe is unmounted and the video stops playing
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => {
      setIsOpen(false);
      setTranscriptOpen(false);
    };
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  const openDialog = () => {
    if (dialogRef.current?.open) return;
    setIsOpen(true);
    dialogRef.current?.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });
  };

  const closeDialog = () => {
    if (!dialogRef.current?.open) return;
    dialogRef.current.close();
  };

  return (
    <div data-component="portrait-video-embed">
      <CardButton type="button" onClick={onOpen ?? openDialog}>
        <span style={{ display: 'block' }}>
          <PosterContainer>
            {posterImage && (
              <PosterImageWrapper>
                <PrismicImage
                  image={{ ...posterImage, alt: null }}
                  quality="low"
                />
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
        </span>
      </CardButton>

      {!onOpen && (
        <VideoDialog
          ref={dialogRef}
          aria-label={title || 'Video'}
          onClick={e => e.target === dialogRef.current && closeDialog()}
        >
          <DialogControls>
            <NavGroup />
            <NavGroup>
              {hasTranscript && (
                <CaptionsButton
                  type="button"
                  onClick={() => setTranscriptOpen(prev => !prev)}
                  aria-expanded={transcriptOpen}
                  aria-controls={uid}
                >
                  {transcriptOpen ? 'Hide captions' : 'Show captions'}
                </CaptionsButton>
              )}
              <DialogButton
                ref={closeButtonRef}
                type="button"
                onClick={closeDialog}
                aria-label="Close video"
              >
                <Icon icon={cross} iconColor="white" />
              </DialogButton>
            </NavGroup>
          </DialogControls>
          <DialogVideoContainer>
            {isOpen && videoSrc && (
              <VideoIframe
                title={title || 'Video'}
                allowFullScreen={true}
                allow="autoplay; picture-in-picture"
                src={videoSrc}
              />
            )}
            {transcript && (
              <TranscriptOverlay
                id={uid}
                $hidden={!transcriptOpen}
                aria-hidden={!transcriptOpen}
              >
                <PrismicHtmlBlock html={transcript} />
              </TranscriptOverlay>
            )}
          </DialogVideoContainer>
        </VideoDialog>
      )}
    </div>
  );
};

export default PortraitVideoEmbed;
