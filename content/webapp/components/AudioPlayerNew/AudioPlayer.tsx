import * as prismic from '@prismicio/client';
import {
  FunctionComponent,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import styled, { css } from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import Space from '@weco/common/views/components/styled/Space';
import { useAVTracking } from '@weco/content/hooks/useAVTracking';

import { formatPlayerTime } from './AudioPlayer.formatters';
import {
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from './AudioPlayer.Icons';
import PlayRate from './AudioPlayer.PlayRate';
import Scrubber from './AudioPlayer.Scrubber';

const AudioPlayerWrapper = styled(Space).attrs({
  as: 'figure',
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
})<{ $isDark: boolean }>`
  background: ${props =>
    props.$isDark ? props.theme.color('black') : props.theme.color('white')};
  margin: 0;
`;

type PlayPauseButtonProps = { $isPlaying: boolean };
const PlayPauseButton = styled.button.attrs<PlayPauseButtonProps>(props => ({
  'aria-pressed': props.$isPlaying,
}))<PlayPauseButtonProps>``;

const TimeWrapper = styled.div.attrs({
  className: font('intr', 5),
})<{ $isDark: boolean }>`
  display: flex;
  justify-content: space-between;
  font-variant-numeric: tabular-nums;
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
`;

const SkipPlayWrapper = styled.div`
  grid-column: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const colorTransform = css<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
  transform: scale(1.1);
`;

const SkipButton = styled.button<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('yellow') : props.theme.color('black')};

  transition:
    color 0.2s ease-out,
    transform 0.2s ease-out;

  @media (hover: hover) {
    &:hover {
      ${colorTransform};
    }
  }

  @media (hover: none) {
    &:active {
      ${colorTransform};
    }
  }
`;

const PlayerRateWrapper = styled.div`
  grid-column: 3;
  display: flex;
  align-items: center;
  justify-content: end;
`;

const colorTransformIconFill = css<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
  transform: scale(1.1);

  .icon__playpause {
    fill: ${props =>
      props.$isDark ? props.theme.color('black') : props.theme.color('white')};
  }
`;

const TitleWrapper = styled.span<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
`;

const PlayPauseInner = styled.div<{ $isDark: boolean }>`
  color: ${props => props.theme.color('yellow')};
  transition:
    color 0.2s ease-out,
    transform 0.2s ease-out;

  .icon__playpause {
    transition: fill 0.2s ease-out;
  }

  @media (hover: hover) {
    &:hover {
      ${colorTransformIconFill};
    }
  }

  @media (hover: none) {
    &:active {
      ${colorTransformIconFill};
    }
  }
`;

const AudioPlayerGrid = styled.div.attrs({})<{ $isEnhanced: boolean }>`
  display: ${props => (props.$isEnhanced ? 'grid' : 'none')};
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
`;

const NowPlayingWrapper = styled(Space).attrs({
  $v: { size: 's', properties: ['margin-top'] },
})`
  grid-column: 1 / -1;
`;

export type AudioPlayerProps = {
  audioFile: string;
  title?: string;
  transcript?: prismic.RichTextField;
  titleProps?: { role: string; 'aria-level': number };
  isDark?: boolean;
};

export const AudioPlayer: FunctionComponent<AudioPlayerProps> = ({
  audioFile,
  title,
  isDark,
  transcript,
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

  const handleSkipBackClick = () => {
    if (!audioPlayerRef.current) return;
    if (!progressBarRef.current) return;

    const newTime = parseInt(progressBarRef.current.value, 10) - 15;

    audioPlayerRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setStartTime(newTime);
  };

  const handleSkipForwardClick = () => {
    if (!audioPlayerRef.current) return;
    if (!progressBarRef.current) return;

    const newTime = parseInt(progressBarRef.current.value, 10) + 15;

    audioPlayerRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setStartTime(newTime);
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
      <AudioPlayerWrapper $isDark={!!isDark}>
        {title && (
          <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
            <figcaption className={font('intb', 5)} {...titleProps}>
              <TitleWrapper $isDark={!!isDark}>{title}</TitleWrapper>
            </figcaption>
          </Space>
        )}

        <AudioPlayerGrid $isEnhanced={isEnhanced}>
          <NowPlayingWrapper>
            <div>
              <TimeWrapper $isDark={!!isDark}>
                <span>
                  <span className="visually-hidden">
                    Elapsed time: {formatPlayerTime(currentTime).nonVisual}
                  </span>
                  <span aria-hidden="true">
                    {formatPlayerTime(currentTime).visual}
                  </span>
                </span>
                {!Number.isNaN(duration) && (
                  <span>
                    <span className="visually-hidden">
                      Total time: {formatPlayerTime(duration).nonVisual}
                    </span>
                    <span aria-hidden="true">
                      {formatPlayerTime(duration).visual}
                    </span>
                  </span>
                )}
              </TimeWrapper>
              <Space
                $v={{
                  size: 's',
                  properties: ['padding-top', 'padding-bottom'],
                }}
              >
                <Scrubber
                  startTime={startTime}
                  duration={duration}
                  id={audioFile}
                  onChange={onScrubberChange}
                  progressBarRef={progressBarRef}
                  currentTime={currentTime}
                  isDark={!!isDark}
                />
              </Space>
            </div>
          </NowPlayingWrapper>
          <SkipPlayWrapper>
            <SkipButton $isDark={!!isDark} onClick={handleSkipBackClick}>
              <span className="visually-hidden">rewind 15 seconds</span>
              <SkipBackIcon />
            </SkipButton>

            <PlayPauseButton onClick={onTogglePlay} $isPlaying={isPlaying}>
              <PlayPauseInner $isDark={!!isDark}>
                <span className="visually-hidden">
                  {isPlaying ? 'Pause' : 'Play'}
                </span>
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
              </PlayPauseInner>
            </PlayPauseButton>
            <SkipButton $isDark={!!isDark} onClick={handleSkipForwardClick}>
              <span className="visually-hidden">fast-forward 15 seconds</span>
              <SkipForwardIcon />
            </SkipButton>
          </SkipPlayWrapper>
          {audioPlayerRef.current && (
            <PlayerRateWrapper>
              <PlayRate
                id={audioFile}
                audioPlayer={audioPlayerRef.current}
                isDark={!!isDark}
              />
            </PlayerRateWrapper>
          )}
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
            darkTheme={isDark}
            id={`audioPlayerTranscript-${audioFile}`}
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
