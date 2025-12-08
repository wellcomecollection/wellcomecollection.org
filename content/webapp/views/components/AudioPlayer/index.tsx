import * as prismic from '@prismicio/client';
import { FunctionComponent, useEffect, useId, useRef, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { font } from '@weco/common/utils/classnames';
import CollapsibleContent from '@weco/common/views/components/CollapsibleContent';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock';
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
import {
  AudioPlayerGrid,
  AudioPlayerWrapper,
  NowPlayingWrapper,
  PlayerRateWrapper,
  PlayPauseButton,
  PlayPauseInner,
  SkipButton,
  SkipPlayWrapper,
  TimeWrapper,
  TitleWrapper,
} from './AudioPlayer.styles';

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
  titleProps,
}) => {
  const { isEnhanced } = useAppContext();
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  // We need static value set to the time that playback begins, to be used as a
  // one-time announcement for screenreaders. Using `currentTime` causes an
  // announcement every second.
  const [startTime, setStartTime] = useState(currentTime);
  const { trackPlay, trackEnded, trackTimeUpdate } = useAVTracking('audio');
  const { activeAudioPlayerId, setActiveAudioPlayerId } = useAppContext();
  const randomisedId = useId();

  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!progressBarRef.current) return;
    // If we change the player dynamically, we need to reset the play/pause
    // button to the appropriate state
    setIsPlaying(false);
    // iOS needs a manual update to currentTime and the progressBarRef
    // to reset the time and the range slider thumb correctly
    // after an audioFile change
    setCurrentTime(0);
    setStartTime(0);
    progressBarRef.current.value = `0`;
  }, [audioFile, progressBarRef.current]);

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

  // Pause playing if another audio player is active
  useEffect(() => {
    if (activeAudioPlayerId !== randomisedId && isPlaying) {
      onTogglePlay();
    }
  }, [activeAudioPlayerId]);

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
    <div data-component="audio-player">
      <AudioPlayerWrapper $isDark={!!isDark}>
        {title && (
          <Space $v={{ size: 'sm', properties: ['margin-bottom'] }}>
            <figcaption className={font('sans-bold', -1)} {...titleProps}>
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
              <Space $v={{ size: '2xs', properties: ['padding-top'] }}>
                <Space $v={{ size: '2xs', properties: ['padding-bottom'] }}>
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
            if (activeAudioPlayerId !== randomisedId)
              setActiveAudioPlayerId(randomisedId);
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
        <Space $v={{ size: 'sm', properties: ['margin-top'] }}>
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
    </div>
  );
};

export default AudioPlayer;
