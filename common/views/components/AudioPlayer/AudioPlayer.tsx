import { useEffect, useRef, useState, FC, Ref } from 'react';
import { dasherize } from '@weco/common/utils/grammar';
import Control from '@weco/common/views/components/Buttons/Control/Control';
import { play, pause } from '@weco/common/icons';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';
import styled from 'styled-components';

const PlayRateWrapper = styled.div.attrs({
  className: classNames({
    flex: true,
    [font('hnr', 6)]: true,
  }),
})`
  gap: 5px;
`;

const ControlWrapper = styled(Space).attrs<{ isPlaying: boolean }>({
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

type ScrubberProps = {
  currentTime: number;
  duration: number;
  onChange: () => void;
  title: string;
  progressBarRef: Ref<HTMLInputElement>;
};

const Scrubber: FC<ScrubberProps> = ({
  currentTime,
  duration,
  onChange,
  title,
  progressBarRef,
}) => {
  const id = dasherize(title.slice(0, 15));

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
    <figure>
      <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
        <figcaption className={font('hnb', 5)}>{title}</figcaption>
      </Space>

      <div className="flex flex--v-center">
        <ControlWrapper isPlaying={isPlaying}>
          <Control
            colorScheme="light"
            icon={isPlaying ? pause : play}
            clickHandler={onTogglePlay}
            text={isPlaying ? `pause` : `play`}
          />
        </ControlWrapper>

        <div className="full-width">
          <div>
            <Scrubber
              currentTime={currentTime}
              duration={duration}
              title={title}
              onChange={onScrubberChange}
              progressBarRef={progressBarRef}
            />
          </div>

          <div
            className="flex flex--h-space-between"
            style={{ fontVariantNumeric: 'tabular-nums' }}
          >
            <div
              className={classNames({
                [font('hnr', 6)]: true,
              })}
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
        </div>
      </div>

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
