import {
  useEffect,
  useRef,
  useState,
  FunctionComponent,
  Ref,
  SyntheticEvent,
  useContext,
} from 'react';
import { dasherize } from '@weco/common/utils/grammar';
import Icon from '@weco/common/views/components/Icon/Icon';
import {
  play,
  pause,
  volumeMuted,
  volume as volumeIcon,
} from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import { font } from '@weco/common/utils/classnames';
import styled from 'styled-components';
import { trackEvent } from '@weco/common/utils/ga';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

const VolumeWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;

  input {
    width: 60px;
  }
`;

const PlayPauseButton = styled.button.attrs<{ isPlaying: boolean }>(props => ({
  className: 'plain-button',
  ariaPressed: props.isPlaying,
}))<{ isPlaying: boolean }>`
  padding: 0;

  svg {
    transform: translateX(${props => (!props.isPlaying ? '2px' : '0')});
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

const MuteUnmuteButton = styled.button.attrs<{ isMuted: boolean }>(props => ({
  className: 'plain-button',
  ariaPressed: props.isMuted,
}))`
  padding: 0;
`;

const PlayRateWrapper = styled.div.attrs({
  className: font('intr', 6),
})`
  display: flex;
  gap: 5px;
`;

const AudioPlayerGrid = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 5px;
`;

const SecondRow = styled.div`
  grid-column: 1 / -1;
`;

const PlayRateRadio = styled.input.attrs({
  type: 'radio',
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
    props.isActive ? props.theme.color('yellow') : undefined}; ;
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

const PlayRate: FunctionComponent<PlayRateProps> = ({ audioPlayer, id }) => {
  const { audioPlaybackRate, setAudioPlaybackRate } = useContext(AppContext);
  const speeds = [0.5, 1, 1.5, 2];

  useEffect(() => {
    audioPlayer.playbackRate = audioPlaybackRate;
  }, [audioPlaybackRate]);

  function updatePlaybackRate(speed: number) {
    trackEvent({
      category: 'Audio',
      action: `set speed to ${speed}x`,
      label: id,
    });

    setAudioPlaybackRate(speed);
    audioPlayer.playbackRate = speed;
  }

  return (
    <PlayRateWrapper
      // This ARIA role -- combined with the shared `name` on the individual buttons --
      // tells screen readers that these radio buttons are part of a single group, and
      // separate from the other buttons on the page.
      //
      // e.g. a screen reader will say "1 of 4" instead of "1 of 112" on an exhibition guide.
      role="radiogroup"
    >
      <span className="visually-hidden">playback rate:</span>
      {speeds.map(speed => {
        // We construct this string here rather than directly in the component so these
        // become a single element on the page.
        //
        // If we had them directly in the component, the iOS screen reader would read
        // the two parts separately,
        // e.g. "one point five (pause) ex" rather than "one point five ex".
        const label = `${speed}x`;

        return (
          <PlayRateLabel
            key={speed}
            htmlFor={`playrate-${speed}-${id}`}
            isActive={audioPlaybackRate === speed}
          >
            <PlayRateRadio
              id={`playrate-${speed}-${id}`}
              onClick={() => updatePlaybackRate(speed)}
              name={`playrate-${id}`}
            />
            {label}
          </PlayRateLabel>
        );
      })}
    </PlayRateWrapper>
  );
};

type VolumeProps = {
  audioPlayer: HTMLAudioElement;
  id: string;
};

const Volume: FunctionComponent<VolumeProps> = ({ audioPlayer, id }) => {
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
      <MuteUnmuteButton onClick={onVolumeButtonClick}>
        <span className="visually-hidden">
          {isMuted ? 'Unmute player' : 'Mute player'}
        </span>
        <Icon
          iconColor="neutral.600"
          icon={isMuted || volume === 0 ? volumeMuted : volumeIcon}
        />
      </MuteUnmuteButton>
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

const Scrubber: FunctionComponent<ScrubberProps> = ({
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
  titleProps?: { role: string; 'aria-level': number };
};

export const AudioPlayer: FunctionComponent<AudioPlayerProps> = ({
  audioFile,
  title,
  idPrefix,
  titleProps = {},
}) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const [shouldLoadMetadata, setShouldLoadMetadata] = useState(false);
  // We need static value set to the time that playback begins, to be used as a
  // one-time announcement for screenreaders. Using `currentTime` causes an
  // announcement every second.
  const [startTime, setStartTime] = useState(currentTime);

  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const audioPlayerGridRef = useRef<HTMLDivElement>(null);
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
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setShouldLoadMetadata(true);
        observer.disconnect();
      }
    });

    audioPlayerGridRef &&
      audioPlayerGridRef.current &&
      observer.observe(audioPlayerGridRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

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
        <figcaption className={font('intb', 5)} {...titleProps}>
          {title}
        </figcaption>
      </Space>

      <AudioPlayerGrid ref={audioPlayerGridRef}>
        <PlayPauseButton onClick={onTogglePlay} isPlaying={isPlaying}>
          <PlayPauseInner>
            <span className="visually-hidden">
              {isPlaying ? 'Pause' : 'Play'}
            </span>
            <Icon iconColor="accent.green" icon={isPlaying ? pause : play} />
          </PlayPauseInner>
        </PlayPauseButton>

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
              className={font('intr', 6)}
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
        preload={shouldLoadMetadata ? 'metadata' : 'none'}
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
