import { useEffect, useRef, useState, FC, Ref, SyntheticEvent } from 'react';
import { dasherize } from '@weco/common/utils/grammar';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import {
  play,
  pause,
  volumeMuted,
  volume as volumeIcon,
} from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { trackEvent } from '@weco/common/utils/ga';

const VolumeWrapper = styled.div`
  display: flex;
  align-items: center;

  button {
    transform: scale(0.7);
  }

  input {
    width: 60px;
  }
`;

// FIXME: this exists because the `volumeMute` icon I created is 1px off
const VolumeControlWrapper = styled.div<{ isMuted: boolean }>`
  ${props =>
    props.isMuted &&
    `
    svg {
      transform: translateY(1px);
    }
  `}
`;

const PlayRateWrapper = styled.div.attrs({
  className: classNames({
    flex: true,
    [font('hnr', 6)]: true,
  }),
})`
  gap: 5px;
`;

const AudioPlayerGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
`;

const SecondRow = styled.div`
  grid-column: 1 / -1;
`;

const PlayControlWrapper = styled(Space).attrs<{ isPlaying: boolean }>({
  h: { size: 'm', properties: ['margin-right'] },
})<{ isPlaying: boolean }>`
  ${props =>
    !props.isPlaying &&
    `
    svg {
      transform: translateX(2px);
    }
  `}
`;

const PlayRateRadio = styled.input.attrs({
  type: 'radio',
  name: 'playback-rate',
})`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  appearance: none;
`;

const PlayRateLabel = styled.label<{ isActive: boolean }>`
  position: relative;
  padding: 0 4px;
  border-radius: 5px;
  text-align: center;
  background: ${props =>
    props.theme.color(props.isActive ? 'yellow' : 'marble')};
`;

const formatVolume = (vol: number): string => {
  return `${Math.floor(vol * 100)}`;
};

const formatTime = (secs: number): { visual: string; nonVisual: string } => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);

  const nonVisualMinutes = (minutes: number): string => {
    switch (minutes) {
      case 0:
        return '';
      case 1:
        return '1 minute and';
      default:
        return `${minutes} minutes and`;
    }
  };

  return {
    visual: `${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`,
    nonVisual: `${nonVisualMinutes(minutes)} ${seconds} seconds`,
  };
};

type PlayRateProps = {
  audioPlayer: HTMLAudioElement;
  id: string;
};

const PlayRate: FC<PlayRateProps> = ({ audioPlayer, id }) => {
  const speeds = [0.5, 1, 1.5, 2];
  const [currentActiveSpeedIndex, setCurrentActiveSpeedIndex] =
    useState<typeof speeds[number]>(1);

  function updatePlaybackRate(speed: number) {
    trackEvent({
      category: 'Audio',
      action: `set speed to ${speed}x`,
      label: id,
    });
    setCurrentActiveSpeedIndex(speeds.indexOf(speed));
    audioPlayer.playbackRate = speed;
  }

  return (
    <PlayRateWrapper>
      {speeds.map(speed => (
        <PlayRateLabel
          key={speed}
          htmlFor={`playrate-${speed}-${id}`}
          isActive={speeds[currentActiveSpeedIndex] === speed}
        >
          <PlayRateRadio
            id={`playrate-${speed}-${id}`}
            onClick={() => updatePlaybackRate(speed)}
          />
          <span className="visually-hidden">playback rate:</span>
          {speed}
          <span aria-hidden="true">x</span>
        </PlayRateLabel>
      ))}
    </PlayRateWrapper>
  );
};

type VolumeProps = {
  audioPlayer: HTMLAudioElement;
  id: string;
};

const Volume: FC<VolumeProps> = ({ audioPlayer, id }) => {
  const [volume, setVolume] = useState(audioPlayer.volume);
  const [isMuted, setIsMuted] = useState(audioPlayer.muted);

  useEffect(() => {
    audioPlayer.volume = volume;
    audioPlayer.muted = isMuted;
  }, [volume, isMuted]);

  const onChange = (event: SyntheticEvent<HTMLInputElement>) => {
    const newValue = parseFloat(event.currentTarget.value);

    if (newValue > 0) {
      setIsMuted(false);
    }

    setVolume(newValue);
  };

  const onVolumeButtonClick = () => {
    trackEvent({
      category: 'Audio',
      action: `${isMuted ? 'unmute' : 'mute'} audio`,
      label: id,
    });
    setIsMuted(!isMuted);
  };
  return (
    <VolumeWrapper>
      <VolumeControlWrapper isMuted={isMuted || volume === 0}>
        <Control
          colorScheme="light"
          icon={isMuted || volume === 0 ? volumeMuted : volumeIcon}
          clickHandler={onVolumeButtonClick}
          text={isMuted ? `muted` : `unmuted`}
          ariaPressed={`${isMuted}`}
        />
      </VolumeControlWrapper>
      <div style={{ lineHeight: 0 }}>
        <label htmlFor={`volume-${id}`}>
          <span className="visually-hidden">volume control</span>
        </label>
        <input
          aria-valuetext={`volume: ${formatVolume(volume)}`}
          id={`volume-${id}`}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={isMuted ? 0 : volume}
          onChange={onChange}
        />
      </div>
    </VolumeWrapper>
  );
};

type ScrubberProps = {
  startTime: number;
  duration: number;
  onChange: () => void;
  id: string;
  progressBarRef: Ref<HTMLInputElement>;
};

const Scrubber: FC<ScrubberProps> = ({
  startTime,
  duration,
  onChange,
  id,
  progressBarRef,
}) => {
  return (
    <div style={{ lineHeight: 0 }}>
      <label className="visually-hidden" htmlFor={`scrubber-${id}`}>
        Audio time scrubber
      </label>
      <input
        className="full-width"
        aria-valuetext={`Elapsed time: ${
          formatTime(startTime).nonVisual
        }, duration ${formatTime(duration).nonVisual}`}
        defaultValue="0"
        id={`scrubber-${id}`}
        min={0}
        onChange={onChange}
        ref={progressBarRef}
        step="any"
        type="range"
      />
    </div>
  );
};

export type AudioPlayerProps = {
  audioFile: string;
  title: string;
  idPrefix?: string;
};

export const AudioPlayer: FC<AudioPlayerProps> = ({
  audioFile,
  title,
  idPrefix,
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  // We need static value set to the time that playback begins, to be used as a
  // one-time announcement for screenreaders. Using `currentTime` causes an
  // announcement every second.
  const [startTime, setStartTime] = useState(currentTime);

  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const id = `${idPrefix || ''}${dasherize(title.slice(0, 15))}`;

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
      trackEvent({
        category: 'Audio',
        action: 'pause audio',
        label: id,
      });
      audioPlayerRef.current.pause();
    } else {
      trackEvent({
        category: 'Audio',
        action: 'play audio',
        label: id,
      });
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
    <figure className="no-margin">
      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
        <figcaption className={font('hnb', 5)}>{title}</figcaption>
      </Space>

      <AudioPlayerGrid>
        <PlayControlWrapper isPlaying={isPlaying}>
          <Control
            colorScheme="light"
            icon={isPlaying ? pause : play}
            clickHandler={onTogglePlay}
            text={isPlaying ? `pause` : `play`}
            ariaPressed={`${isPlaying}`}
          />
        </PlayControlWrapper>

        <div className="full-width">
          <Scrubber
            startTime={startTime}
            duration={duration}
            id={id}
            onChange={onScrubberChange}
            progressBarRef={progressBarRef}
          />
        </div>
        {audioPlayerRef.current && (
          <Volume audioPlayer={audioPlayerRef.current} id={id} />
        )}
        <SecondRow>
          <div className="flex flex--h-space-between">
            <div
              className={classNames({
                [font('hnr', 6)]: true,
              })}
              style={{
                fontVariantNumeric: 'tabular-nums',
                whiteSpace: 'nowrap',
              }}
            >
              <span>
                <span className="visually-hidden">
                  Elapsed time: {formatTime(currentTime).nonVisual}
                </span>
                <span aria-hidden="true">{formatTime(currentTime).visual}</span>
              </span>
              {!Number.isNaN(duration) && (
                <>
                  {' '}
                  <span aria-hidden="true">/</span>{' '}
                  <span>
                    <span className="visually-hidden">
                      Total time: {formatTime(duration).nonVisual}
                    </span>
                    <span aria-hidden="true">
                      {formatTime(duration).visual}
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
        onLoadedMetadata={onLoadedMetadata}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={onTimeUpdate}
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
    </figure>
  );
};

export default AudioPlayer;
