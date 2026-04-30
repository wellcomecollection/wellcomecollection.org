import * as prismic from '@prismicio/client';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import useVideoEmbed from '@weco/common/hooks/useVideoEmbed';
import { chevron, cross } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import Icon from '@weco/common/views/components/Icon';
import { gridSize12 } from '@weco/common/views/components/Layout';
import PortraitVideoEmbed from '@weco/common/views/components/PortraitVideoEmbed';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import Space from '@weco/common/views/components/styled/Space';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import { ListItem } from '@weco/content/views/components/ScrollContainer/ScrollContainer.styles';

import { Title } from './PortraitVideoList.styles';

export type PortraitVideoItem = {
  embedUrl: string;
  posterImage?: ImageType;
  duration?: string;
  title?: string;
  transcript?: prismic.RichTextField;
};

type Props = {
  title?: string;
  items: PortraitVideoItem[];
  gridSizes?: SizeMap;
  useShim?: boolean;
};

const VideoDialog = styled.dialog`
  padding: 0;
  border: 0;
  background: ${props => props.theme.color('black')};
  width: min(400px, calc(90dvh * 9 / 16), 90vw);
  aspect-ratio: 9 / 16;
  overflow: hidden;

  &::backdrop {
    background: rgba(0, 0, 0, 0.85);
  }
`;

const DialogControls = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  pointer-events: none;
`;

const NavGroup = styled.span`
  display: flex;
  pointer-events: auto;
`;

const DialogButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: 0;
  cursor: pointer;
  background: transparent;
  color: ${props => props.theme.color('white')};
  pointer-events: auto;
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

const PortraitVideoList: FunctionComponent<Props> = ({
  title,
  items,
  gridSizes = gridSize12(),
  useShim,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const hasPrev = activeIndex !== null && activeIndex > 0;
  const hasNext = activeIndex !== null && activeIndex < items.length - 1;

  // Hook must be called unconditionally; passes empty string when no item is active
  const { videoSrc, uid } = useVideoEmbed(activeItem?.embedUrl ?? '');

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setActiveIndex(null);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  const openAt = (index: number) => {
    setActiveIndex(index);
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal();
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  };

  const closeDialog = () => {
    if (!dialogRef.current?.open) return;
    dialogRef.current.close();
  };

  const navigate = (dir: -1 | 1) => {
    if (activeIndex === null) return;
    setActiveIndex(activeIndex + dir);
  };

  if (items.length === 0) return null;

  const prevLabel =
    hasPrev && activeIndex !== null && items[activeIndex - 1]?.title
      ? `Previous video: ${items[activeIndex - 1].title}`
      : 'Previous video';

  const nextLabel =
    hasNext && activeIndex !== null && items[activeIndex + 1]?.title
      ? `Next video: ${items[activeIndex + 1].title}`
      : 'Next video';

  return (
    <div data-component="portrait-video-list">
      <ScrollContainer
        gridSizes={gridSizes}
        useShim={useShim}
        CopyContent={title ? <Title>{title}</Title> : undefined}
      >
        {items.map((item, i) => (
          <ListItem key={i} $usesShim={useShim} $cols={3}>
            <PortraitVideoEmbed {...item} onOpen={() => openAt(i)} />
          </ListItem>
        ))}
      </ScrollContainer>

      <VideoDialog
        ref={dialogRef}
        aria-label={activeItem?.title || 'Video'}
        onClick={e => e.target === dialogRef.current && closeDialog()}
      >
        <DialogControls>
          <NavGroup>
            <DialogButton
              type="button"
              onClick={() => navigate(-1)}
              aria-label={prevLabel}
              style={{ visibility: hasPrev ? 'visible' : 'hidden' }}
            >
              <Icon icon={chevron} rotate={90} iconColor="white" />
            </DialogButton>
            <DialogButton
              type="button"
              onClick={() => navigate(1)}
              aria-label={nextLabel}
              style={{ visibility: hasNext ? 'visible' : 'hidden' }}
            >
              <Icon icon={chevron} rotate={270} iconColor="white" />
            </DialogButton>
          </NavGroup>
          <DialogButton
            ref={closeButtonRef}
            type="button"
            onClick={closeDialog}
            aria-label="Close video"
          >
            <Icon icon={cross} iconColor="white" />
          </DialogButton>
        </DialogControls>

        <DialogVideoContainer>
          {activeIndex !== null && videoSrc && (
            <VideoIframe
              key={activeIndex}
              title={activeItem?.title || 'Video'}
              allowFullScreen={true}
              allow="autoplay; picture-in-picture"
              src={videoSrc}
            />
          )}
        </DialogVideoContainer>

        {!!(
          activeItem?.transcript?.length && activeItem.transcript.length > 0
        ) && (
          <TranscriptPanel key={activeIndex}>
            <CollapsibleContent
              id={`portraitVideoListTranscript-${uid}`}
              controlText={{
                defaultText: 'Read the transcript',
                contentShowingText: 'Hide the transcript',
              }}
            >
              <PrismicHtmlBlock html={activeItem.transcript} />
            </CollapsibleContent>
          </TranscriptPanel>
        )}
      </VideoDialog>
    </div>
  );
};

export default PortraitVideoList;
