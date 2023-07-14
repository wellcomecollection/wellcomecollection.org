import { FunctionComponent, Ref } from 'react';
import { formatPlayerTime } from './AudioPlayer.formatters';

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
        style={{ width: '100%' }}
        aria-valuetext={`Elapsed time: ${
          formatPlayerTime(startTime).nonVisual
        }, duration ${formatPlayerTime(duration).nonVisual}`}
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

export default Scrubber;
