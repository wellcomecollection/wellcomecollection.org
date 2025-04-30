import * as prismic from '@prismicio/client';
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import AppContext from '@weco/common/contexts/AppContext';
import { pause, play } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { dasherize } from '@weco/common/utils/grammar';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import Icon from '@weco/common/views/components/Icon';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import { useAVTracking } from '@weco/content/hooks/useAVTracking';

import { formatPlayerTime } from './AudioPlayer.formatters';
import PlayRate from './AudioPlayer.PlayRate';
import Scrubber from './AudioPlayer.Scrubber';
import Volume from './AudioPlayer.Volume';

const AudioPlayerWrapper = styled.figure`
  margin: 0;
`;

type PlayPauseButtonProps = { $isPlaying: boolean };
const PlayPauseButton = styled.button.attrs<PlayPauseButtonProps>(props => ({
  'aria-pressed': props.$isPlaying,
}))<PlayPauseButtonProps>`
  padding: 0;

  svg {
    transform: translateX(${props => (!props.$isPlaying ? '2px' : '0')});
  }
`;

const PlayPauseInner = styled.div`
  border: 2px solid ${props => props.theme.color('accent.green')};
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AudioPlayerGrid = styled(Space).attrs({
  $h: {
    size: 's',
    properties: ['column-gap'],
    overrides: { medium: 2, large: 2 },
  },
  $v: {
    size: 's',
    properties: ['row-gap'],
    overrides: { medium: 2, large: 2 },
  },
})<{ $isEnhanced: boolean }>`
  display: ${props => (props.$isEnhanced ? 'grid' : 'none')};
  grid-template-columns: auto 1fr auto;
  align-items: center;
`;

const SecondRow = styled.div`
  grid-column: 1 / -1;
`;

export type AudioPlayerProps = {
  audioFile: string;
  title: string;
  transcript?: prismic.RichTextField;
  idPrefix?: string;
  titleProps?: { role: string; 'aria-level': number };
};

export const AudioPlayer: FunctionComponent<AudioPlayerProps> = ({
  audioFile,
  title,
  transcript,
  idPrefix,
  titleProps = {},
}) => {
  const { isEnhanced } = useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  // We need static value set to the time that playback begins, to be used as a
  // one-time announcement for screenreaders. Using `currentTime` causes an
  // announcement every second.
  const [startTime, setStartTime] = useState(currentTime);
  const { trackPlay, trackEnded, trackTimeUpdate } = useAVTracking('audio');

  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const id = `${idPrefix || ''}${dasherize(title.slice(0, 15))}`;

  useEffect(() => {
    // If we change the player dynamically, we need to reset the play/pause
    // button to the appropriate state
    setIsPlaying(false);
  }, [audioFile]);

  useEffect(() => {
    if (!audioPlayerRef.current) return;
    if (!progressBarRef.current) return;

    const seconds = Math.floor(audioPlayerRef.current.duration);
    setDuration(seconds);

    progressBarRef.current.max = `${seconds}`;
  }, [
    isMetadataLoaded,
    audioPlayerRef.current?.readyState,
    progressBarRef.current,
  ]);

  useEffect(() => {
    if (!progressBarRef.current) return;

    function updateStartTime() {
      setStartTime(currentTime);
    }

    progressBarRef.current.addEventListener('focus', updateStartTime);

    return () => {
      if (!progressBarRef.current) return;

      progressBarRef.current.removeEventListener('focus', updateStartTime);
    };
  }, [progressBarRef.current, currentTime]);

  const onTogglePlay = () => {
    if (!audioPlayerRef.current) return;

    const prevValue = isPlaying;

    setIsPlaying(!prevValue);

    if (prevValue) {
      audioPlayerRef.current.pause();
    } else {
      audioPlayerRef.current.play();
    }
  };

  const onScrubberChange = () => {
    if (!audioPlayerRef.current) return;
    if (!progressBarRef.current) return;

    const newTime = parseInt(progressBarRef.current.value, 10);

    audioPlayerRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setStartTime(newTime);
  };

  const onLoadedMetadata = () => {
    if (!audioPlayerRef.current) return;

    setIsMetadataLoaded(true);
    setDuration(Math.floor(audioPlayerRef.current.duration));
  };

  const onTimeUpdate = () => {
    if (!audioPlayerRef.current) return;
    if (!progressBarRef.current) return;

    const newTime = Math.floor(audioPlayerRef.current.currentTime);

    progressBarRef.current.value = `${newTime}`;
    setCurrentTime(newTime);
  };

  return (
    <>
      <AudioPlayerWrapper>
        {title && (
          <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
            <figcaption className={font('intb', 5)} {...titleProps}>
              {title}
            </figcaption>
          </Space>
        )}

        <AudioPlayerGrid $isEnhanced={isEnhanced}>
          <PlayPauseButton onClick={onTogglePlay} $isPlaying={isPlaying}>
            <PlayPauseInner>
              <span className="visually-hidden">
                {`${title} ${isPlaying ? 'Pause' : 'Play'}`}
              </span>
              <Icon iconColor="accent.green" icon={isPlaying ? pause : play} />
            </PlayPauseInner>
          </PlayPauseButton>

          <div style={{ width: '100%' }}>
            <Scrubber
              startTime={startTime}
              duration={duration}
              id={id}
              onChange={onScrubberChange}
              progressBarRef={progressBarRef}
            />
          </div>
          {audioPlayerRef.current && (
            <Volume
              audioPlayer={audioPlayerRef.current}
              id={id}
              title={title}
            />
          )}
          <SecondRow>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div
                className={font('intr', 6)}
                style={{
                  fontVariantNumeric: 'tabular-nums',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>
                  <span className="visually-hidden">
                    Elapsed time: {formatPlayerTime(currentTime).nonVisual}
                  </span>
                  <span aria-hidden="true">
                    {formatPlayerTime(currentTime).visual}
                  </span>
                </span>
                {!Number.isNaN(duration) && (
                  <>
                    {' '}
                    <span aria-hidden="true">/</span>{' '}
                    <span>
                      <span className="visually-hidden">
                        Total time: {formatPlayerTime(duration).nonVisual}
                      </span>
                      <span aria-hidden="true">
                        {formatPlayerTime(duration).visual}
                      </span>
                    </span>
                  </>
                )}
              </div>
              {audioPlayerRef.current && (
                <PlayRate id={id} audioPlayer={audioPlayerRef.current} />
              )}
            </div>
          </SecondRow>
        </AudioPlayerGrid>

        <audio
          controls={!isEnhanced}
          onLoadedMetadata={onLoadedMetadata}
          onPlay={event => {
            trackPlay(event);
            setIsPlaying(true);
          }}
          onEnded={trackEnded}
          onPause={() => setIsPlaying(false)}
          onTimeUpdate={event => {
            onTimeUpdate();
            trackTimeUpdate(event);
          }}
          preload="metadata"
          ref={audioPlayerRef}
          src={audioFile}
        >
          <p>
            Your browser does not support the <code>audio</code> element.
            <a href={audioFile}>Download the audio</a>
            instead.
          </p>
        </audio>
      </AudioPlayerWrapper>

      {!!(transcript?.length && transcript.length > 0) && (
        <Space $v={{ size: 'm', properties: ['margin-top'] }}>
          <CollapsibleContent
            id={`audioPlayerTranscript-${title}`}
            controlText={{
              contentShowingText: 'Hide the transcript',
              defaultText: 'Read the transcript',
            }}
          >
            <PrismicHtmlBlock html={transcript} />
          </CollapsibleContent>
        </Space>
      )}
    </>
  );
};

export default AudioPlayer;
