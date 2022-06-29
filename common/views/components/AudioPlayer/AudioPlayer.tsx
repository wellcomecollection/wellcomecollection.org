import { useEffect, useRef, useState, FC, Ref, SyntheticEvent } from 'react';
import { dasherize } from '@weco/common/utils/grammar';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import { play, pause, volume as volumeIcon } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';

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
  grid-column: 2 / -1;
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

const PlayRateButton = styled.button<{ isActive: boolean }>`
  border: 0;
  border-radius: 6px;
  background: ${props =>
    props.theme.color(props.isActive ? 'yellow' : 'smoke')};
  appearance: none;
`;

const formatVolume = (vol: number): string => {
  return `${Math.floor(vol * 100)}`;
};

const formatTime = (secs: number): string => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);

  return `${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`;
};

type PlayRateProps = {
  audioPlayer: HTMLAudioElement;
};

const PlayRate: FC<PlayRateProps> = ({ audioPlayer }) => {
  const speeds = [0.5, 1, 1.5, 2];
  const [currentActiveSpeedIndex, setCurrentActiveSpeedIndex] =
    useState<typeof speeds[number]>(1);

  function updatePlaybackRate(speed: number) {
    setCurrentActiveSpeedIndex(speeds.indexOf(speed));
    audioPlayer.playbackRate = speed;
  }

  return (
    <PlayRateWrapper>
      {speeds.map(speed => (
        <PlayRateButton
          key={speed}
          isActive={speeds[currentActiveSpeedIndex] === speed}
          onClick={() => updatePlaybackRate(speed)}
        >
          <span className="visually-hidden">Playback speed:</span>
          {speed}
          <span aria-hidden="true">x</span>
        </PlayRateButton>
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
  return (
    <VolumeWrapper>
      <Control
        colorScheme="light"
        icon={isMuted || volume === 0 ? pause : volumeIcon}
        clickHandler={() => setIsMuted(!isMuted)}
        text={isMuted ? `muted` : `unmuted`}
        aria-pressed={isMuted}
      />
      <label htmlFor={`volume-${id}`}>
        <span className="visually-hidden">volume</span>
      </label>
      <input
        aria-valuetext={formatVolume(volume)}
        id={`volume-${id}`}
        type="range"
        min={0}
        max={1}
        step="any"
        value={isMuted ? 0 : volume}
        onChange={onChange}
      />
    </VolumeWrapper>
  );
};

type ScrubberProps = {
  currentTime: number;
  duration: number;
  onChange: () => void;
  id: string;
  progressBarRef: Ref<HTMLInputElement>;
};

const Scrubber: FC<ScrubberProps> = ({
  currentTime,
  duration,
  onChange,
  id,
  progressBarRef,
}) => {
  return (
    <div>
      <div>
        <label className="visually-hidden" htmlFor={`scrubber-${id}`}>
          {`Audio time scrubber ${formatTime(currentTime)} / ${formatTime(
            duration
          )}`}
        </label>
        <input
          className="full-width"
          aria-valuetext={`Elapsed time: ${formatTime(currentTime)}`}
          defaultValue="0"
          id={`scrubber-${id}`}
          min={0}
          onChange={onChange}
          ref={progressBarRef}
          step="any"
          type="range"
        />
      </div>
    </div>
  );
};

type AudioPlayerProps = {
  audioFile: string;
  title: string;
};

export const AudioPlayer: FC<AudioPlayerProps> = ({ audioFile, title }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMetadataLoaded, setIsMetadataLoaded] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLInputElement>(null);
  const id = dasherize(title.slice(0, 15));

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

  const changePlayerCurrentTime = () => {
    if (!progressBarRef.current) return;

    const progressValue = parseInt(progressBarRef.current.value, 10);

    setCurrentTime(progressValue);
  };

  const onScrubberChange = () => {
    if (!audioPlayerRef.current) return;
    if (!progressBarRef.current) return;

    audioPlayerRef.current.currentTime = parseInt(
      progressBarRef.current.value,
      10
    );
    changePlayerCurrentTime();
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
          />
        </PlayControlWrapper>

        <div className="full-width">
          <Scrubber
            currentTime={currentTime}
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
                <span className="visually-hidden">Elapsed time:</span>
                {formatTime(currentTime)}
              </span>
              {!Number.isNaN(duration) && (
                <>
                  {' '}
                  /{' '}
                  <span>
                    <span className="visually-hidden">Total time:</span>
                    {formatTime(duration)}
                  </span>
                </>
              )}
            </div>
            {audioPlayerRef.current && (
              <PlayRate audioPlayer={audioPlayerRef.current} />
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
