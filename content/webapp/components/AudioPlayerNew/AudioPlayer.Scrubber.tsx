import { FunctionComponent, Ref } from 'react';
import styled, { css } from 'styled-components';

import { formatPlayerTime } from './AudioPlayer.formatters';

const backgroundTransform = css<{ $isDark: boolean }>`
  background: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
  transform: scale(1.5);
`;

const thumbStyles = css`
  background: ${props => props.theme.color('yellow')};
  appearance: none;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 0;

  transition:
    background 0.2s ease-out,
    transform 0.2s ease-out;

  @media (hover: hover) {
    &:hover {
      ${backgroundTransform};
    }
  }

  @media (hover: none) {
    &:active {
      ${backgroundTransform};
    }
  }
`;

const RangeSlider = styled.input.attrs({
  type: 'range',
  step: 'any',
})<{ $isDark: boolean }>`
  cursor: pointer;
  position: relative;
  z-index: 1;
  appearance: none;
  background: transparent;

  &::-webkit-slider-thumb {
    ${thumbStyles};
  }

  &::-moz-range-thumb {
    ${thumbStyles};
  }
`;

const PercentComplete = styled.div<{
  $isDark: boolean;
  $percentComplete: number;
}>`
  position: relative;

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    content: '';
    height: 4px;
    width: 100%;
    background-color: ${props =>
      props.$isDark
        ? props.theme.color('neutral.400')
        : props.theme.color('neutral.500')};
    border-radius: 4px;
    transform: translateY(-50%);
  }

  &::after {
    position: absolute;
    top: 50%;
    left: 0;
    content: '';
    height: 4px;
    width: ${props => props.$percentComplete}%;
    background-color: ${props => props.theme.color('yellow')};
    border-radius: 4px;
    transform: translateY(-50%);
    max-width: 100%;
  }

  @media (hover: hover) {
    &:hover
      ${RangeSlider}::-webkit-slider-thumb,
      &:hover
      ${RangeSlider}::-moz-range-thumb {
      ${backgroundTransform};
    }
  }
`;

type ScrubberProps = {
  startTime: number;
  duration: number;
  onChange: () => void;
  id: string;
  progressBarRef: Ref<HTMLInputElement>;
  currentTime: number;
  isDark: boolean;
};

const Scrubber: FunctionComponent<ScrubberProps> = ({
  startTime,
  duration,
  onChange,
  id,
  progressBarRef,
  currentTime,
  isDark,
}) => {
  return (
    <div style={{ lineHeight: 0 }}>
      <label className="visually-hidden" htmlFor={`scrubber-${id}`}>
        Audio time scrubber
      </label>
      <PercentComplete
        $percentComplete={(100 / duration) * Number(currentTime)}
        $isDark={isDark}
      >
        <RangeSlider
          $isDark={isDark}
          style={{ width: '100%' }}
          aria-valuetext={`Elapsed time: ${
            formatPlayerTime(startTime).nonVisual
          }, duration ${formatPlayerTime(duration).nonVisual}`}
          defaultValue="0"
          id={`scrubber-${id}`}
          min={0}
          onChange={onChange}
          ref={progressBarRef}
        />
      </PercentComplete>
    </div>
  );
};

export default Scrubber;
