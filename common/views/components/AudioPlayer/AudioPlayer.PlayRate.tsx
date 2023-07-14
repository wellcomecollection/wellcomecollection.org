import { FunctionComponent, useContext, useEffect } from 'react';
import styled from 'styled-components';
import { AppContext } from '../AppContext/AppContext';
import { trackGaEvent } from '@weco/common/utils/ga';
import { font } from '@weco/common/utils/classnames';

const PlayRateWrapper = styled.div.attrs({
  className: font('intr', 6),
})`
  display: flex;
  gap: 5px;
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
    props.isActive ? props.theme.color('yellow') : undefined};
`;

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
    trackGaEvent({
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

export default PlayRate;
