import * as prismic from '@prismicio/client';
import { FunctionComponent, useEffect, useRef, useState } from 'react';

import useVideoEmbed, { VideoProvider } from '@weco/common/hooks/useVideoEmbed';
import { chevron, cross } from '@weco/common/icons';
import { ImageType } from '@weco/common/model/image';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import { gridSize12 } from '@weco/common/views/components/Layout';
import PortraitVideoEmbed from '@weco/common/views/components/PortraitVideoEmbed';
import {
  DialogButton,
  DialogControls,
  DialogVideoContainer,
  NavGroup,
  TranscriptButton,
  TranscriptOverlay,
  VideoDialog,
  VideoIframe,
} from '@weco/common/views/components/PortraitVideoEmbed/PortraitVideoDialog.styles';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import { SizeMap } from '@weco/common/views/components/styled/Grid';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';
import { ListItem } from '@weco/content/views/components/ScrollContainer/ScrollContainer.styles';

export type PortraitVideoItem = {
  embedUrl: string;
  videoProvider?: VideoProvider;
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

const PortraitVideoList: FunctionComponent<Props> = ({
  title,
  items,
  gridSizes = gridSize12(),
  useShim,
}) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const hasPrev = activeIndex !== null && activeIndex > 0;
  const hasNext = activeIndex !== null && activeIndex < items.length - 1;
  const hasTranscript = !!(
    activeItem?.transcript?.length && activeItem.transcript.length > 0
  );

  // Hook must be called unconditionally; passes empty string when no item is active
  const { videoSrc, uid } = useVideoEmbed(
    activeItem?.embedUrl ?? '',
    activeItem?.videoProvider
  );

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const handleClose = () => setActiveIndex(null);
    dialog.addEventListener('close', handleClose);
    return () => dialog.removeEventListener('close', handleClose);
  }, []);

  useEffect(() => {
    setTranscriptOpen(false);
  }, [activeIndex]);

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
    setActiveIndex(prev => {
      if (prev === null) return prev;
      return Math.max(0, Math.min(items.length - 1, prev + dir));
    });
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
        CopyContent={
          title ? <h2 className={font('brand-bold', 1)}>{title}</h2> : undefined
        }
      >
        {items.map((item, i) => (
          <ListItem key={i} $usesShim={useShim} $cols={3}>
            <PortraitVideoEmbed
              posterImage={item.posterImage}
              duration={item.duration}
              title={item.title}
              onOpen={() => openAt(i)}
            />
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
              disabled={!hasPrev}
            >
              <span className="visually-hidden">{prevLabel}</span>
              <Icon icon={chevron} rotate={90} iconColor="white" />
            </DialogButton>
            <DialogButton
              type="button"
              onClick={() => navigate(1)}
              disabled={!hasNext}
            >
              <span className="visually-hidden">{nextLabel}</span>
              <Icon icon={chevron} rotate={270} iconColor="white" />
            </DialogButton>
          </NavGroup>
          <NavGroup>
            {hasTranscript && (
              <TranscriptButton
                type="button"
                onClick={() => setTranscriptOpen(prev => !prev)}
                aria-expanded={transcriptOpen}
                aria-controls={uid}
              >
                {transcriptOpen ? 'Hide transcript' : 'Show transcript'}
              </TranscriptButton>
            )}
            <DialogButton
              ref={closeButtonRef}
              type="button"
              onClick={closeDialog}
            >
              <span className="visually-hidden">Close video</span>
              <Icon icon={cross} iconColor="white" />
            </DialogButton>
          </NavGroup>
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
          {activeItem?.transcript && (
            <TranscriptOverlay
              id={uid}
              $hidden={!transcriptOpen}
              aria-hidden={!transcriptOpen}
            >
              <PrismicHtmlBlock html={activeItem.transcript} />
            </TranscriptOverlay>
          )}
        </DialogVideoContainer>
      </VideoDialog>
    </div>
  );
};

export default PortraitVideoList;
