import { useEffect, useRef, useState, FC, Ref } from 'react';
import formatTime, { formatListenToTime } from './format-time';

type PlaybackSpeedButtonProps = {
  audioPlayer: HTMLAudioElement;
};

const PlaybackSpeedButton: FC<PlaybackSpeedButtonProps> = ({ audioPlayer }) => {
  const [activeSpeedOptionBtn, setActiveSpeedOptionBtn] = useState(1);

  const onChangeSpeed = (speed: number) => {
    const speedOptionsArray = [1, 1.5, 2, 0.5];
    const prevSpeedIndex = speedOptionsArray.indexOf(speed);
    const nextSpeedIndex = prevSpeedIndex + 1;
    const lastItemIndex = speedOptionsArray.length - 1;

    if (nextSpeedIndex > lastItemIndex) {
      setActiveSpeedOptionBtn(speedOptionsArray[0]);
      audioPlayer.playbackRate = speedOptionsArray[0];
    } else {
      setActiveSpeedOptionBtn(speedOptionsArray[nextSpeedIndex]);
      audioPlayer.playbackRate = speedOptionsArray[nextSpeedIndex];
    }
  };

  return (
    <div>
      <button onClick={() => onChangeSpeed(activeSpeedOptionBtn)}>
        <span className="visually-hidden">Playback speed:</span>
        {activeSpeedOptionBtn}
        <span aria-hidden="true">x</span>
      </button>
    </div>
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
  const id = title.trim().toLowerCase().slice(0, 15).replaceAll(' ', '-');

  return (
    <div>
      <div>
        <label className="visually-hidden" htmlFor={`scrubber-${id}`}>
          {`Audio time scrubber ${formatTime(currentTime)} / ${formatTime(
            duration
          )}`}
        </label>
        <input
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

type ToggleProps = {
  isPlaying: boolean;
  onClick: () => void;
  onText: string;
  offText: string;
};

const Toggle: FC<ToggleProps> = ({ isPlaying, onClick, onText, offText }) => {
  return (
    <div>
      {isPlaying ? (
        <button onClick={onClick}>{offText}</button>
      ) : (
        <button onClick={onClick}>{onText}</button>
      )}
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
  const [isMuted, setIsMuted] = useState(false);
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

  const onToggleMute = () => {
    if (!audioPlayerRef.current) return;

    setIsMuted(!isMuted);
    audioPlayerRef.current.muted = !isMuted;
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
    <div>
      <div>
        <span>Listen to this article</span>
        <span>{formatListenToTime(duration)}</span>
      </div>

      <figure>
        <figcaption>{title}</figcaption>

        <div>
          <Toggle
            onText={`play`}
            offText={`pause`}
            isPlaying={isPlaying}
            onClick={onTogglePlay}
          />

          <div>
            <Scrubber
              currentTime={currentTime}
              duration={duration}
              title={title}
              onChange={onScrubberChange}
              progressBarRef={progressBarRef}
            />

            <div>
              <div>
                <span>
                  <span className="visually-hidden">Elapsed time:</span>
                  {formatTime(currentTime)}
                </span>
                {!Number.isNaN(duration) && (
                  <span>
                    <span className="visually-hidden">Total time:</span>
                    {formatTime(duration)}
                  </span>
                )}
              </div>
              {audioPlayerRef.current && (
                <PlaybackSpeedButton audioPlayer={audioPlayerRef.current} />
              )}
            </div>
          </div>

          <Toggle
            onText={`mute`}
            offText={`unmute`}
            isPlaying={isMuted}
            onClick={onToggleMute}
          />
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
    </div>
  );
};

export default AudioPlayer;
