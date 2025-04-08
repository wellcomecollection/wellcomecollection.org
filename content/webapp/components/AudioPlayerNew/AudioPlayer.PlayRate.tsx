import { FunctionComponent, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import Space from '@weco/common/views/components/styled/Space';

const OpenSelectButton = styled.button.attrs({
  className: font('intr', 6),
})<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};

  span {
    display: flex;
    justify-content: end;
    color: ${props => props.theme.color('yellow')};
  }
`;

const PlayRateButton = styled.button.attrs({
  className: font('intr', 6),
})<{
  $isDark: boolean;
  $isActive?: boolean;
}>`
  display: flex;
  color: ${props =>
    props.$isActive
      ? props.theme.color('yellow')
      : props.$isDark
        ? props.theme.color('white')
        : props.theme.color('black')};
`;

const PlayRateList = styled(Space).attrs({
  $v: { size: 's', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})<{ $isActive: boolean; $isDark: boolean }>`
  list-style: none;
  display: ${props => (props.$isActive ? 'block' : 'none')};
  background-color: ${props =>
    props.$isDark
      ? props.theme.color('neutral.700')
      : props.theme.color('white')};
  z-index: 1;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  box-shadow: ${props => props.theme.basicBoxShadow};
`;

type PlayRateProps = {
  audioPlayer: HTMLAudioElement;
  id: string;
  isDark: boolean;
};

const PlayRate: FunctionComponent<PlayRateProps> = ({
  audioPlayer,
  isDark,
}) => {
  const { audioPlaybackRate, setAudioPlaybackRate } = useContext(AppContext);
  const speeds = [0.5, 1, 1.5, 2];
  const [isSheetActive, setIsSheetActive] = useState(false);

  useEffect(() => {
    audioPlayer.playbackRate = audioPlaybackRate;
  }, [audioPlaybackRate]);

  function updatePlaybackRate(speed: number) {
    setAudioPlaybackRate(speed);
    audioPlayer.playbackRate = speed;
    setIsSheetActive(false);
  }

  function showSheet() {
    setIsSheetActive(true);
  }

  return (
    <>
      <OpenSelectButton $isDark={isDark} onClick={showSheet}>
        speed
        <span>{audioPlaybackRate}x</span>
      </OpenSelectButton>
      <PlayRateList $isActive={isSheetActive} $isDark={isDark}>
        {speeds.map(speed => {
          return (
            <li key={speed}>
              <PlayRateButton
                $isActive={audioPlaybackRate === speed}
                $isDark={isDark}
                onClick={() => updatePlaybackRate(speed)}
              >
                {speed}x
              </PlayRateButton>
            </li>
          );
        })}
      </PlayRateList>
    </>
  );
};

export default PlayRate;
