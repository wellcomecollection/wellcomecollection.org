import { FocusTrap } from 'focus-trap-react';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { check } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';

const PlayRateContainer = styled.div`
  position: relative;
  anchor-scope: --play-rate-button;
`;

const TogglePlayRateButton = styled.button.attrs({
  className: font('sans', -2),
})<{ $isDark: boolean }>`
  anchor-name: --play-rate-button;
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
  padding: 0;
  transition: color 0.2s ease-in-out;

  span {
    display: flex;
    justify-content: end;
  }

  &:hover {
    color: ${props =>
      props.$isDark ? props.theme.color('yellow') : props.theme.color('black')};
  }
`;

const PlayRateButton = styled.div.attrs({
  as: 'button',
  className: font('sans', -1),
})<{
  $isDark: boolean;
}>`
  padding: ${props => props.theme.spacingUnits['150']};
  line-height: 1.5;
  display: flex;
  justify-content: space-between;
  width: 100%;
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};

  &:hover {
    text-decoration: underline;
  }
`;

const PlayRateList = styled.div<{ $isActive: boolean; $isDark: boolean }>`
  margin-bottom: 10px;
  position: absolute;
  bottom: 100%;
  right: 0;

  @supports (position-anchor: --play-rate-button) {
    position-anchor: --play-rate-button;
    position: fixed;
    bottom: anchor(top);
    right: anchor(right);
    position-try-fallbacks: --below;

    @position-try --below {
      bottom: auto;
      top: anchor(bottom);
      margin-top: 10px;
      margin-bottom: 0;
    }
  }

  padding: ${props => props.theme.spacingUnits['100']} 0;
  list-style: none;
  display: ${props => (props.$isActive ? 'block' : 'none')};
  background-color: ${props =>
    props.$isDark
      ? props.theme.color('neutral.700')
      : props.theme.color('white')};
  z-index: 2;
  border-radius: 8px;
  box-shadow: ${props => props.theme.basicBoxShadow};

  ul {
    margin: 0;
    padding: 0;
  }
`;

type PlayRateProps = {
  audioPlayer: HTMLAudioElement;
  id: string;
  isDark: boolean;
};

const PlayRate: FunctionComponent<PlayRateProps> = ({
  audioPlayer,
  isDark,
  id,
}) => {
  const [isPlayrateActive, setIsPlayrateActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { audioPlaybackRate, setAudioPlaybackRate } = useAppContext();
  const speeds = [0.5, 1, 1.5, 2];

  useEffect(() => {
    audioPlayer.playbackRate = audioPlaybackRate;
  }, [audioPlaybackRate]);

  useEffect(() => {
    audioPlayer.playbackRate = audioPlaybackRate;
  }, [id]);

  function updatePlaybackRate(speed: number) {
    setAudioPlaybackRate(speed);
    audioPlayer.playbackRate = speed;
    setIsPlayrateActive(false);
  }

  function toggleShowHidePlayRate() {
    setIsPlayrateActive(!isPlayrateActive);
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsPlayrateActive(false);
      }
    }

    document.addEventListener('click', handleClickOutside);

    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <FocusTrap
      active={isPlayrateActive}
      focusTrapOptions={{
        clickOutsideDeactivates: true,
      }}
    >
      <PlayRateContainer ref={containerRef}>
        <TogglePlayRateButton
          $isDark={isDark}
          onClick={toggleShowHidePlayRate}
          aria-controls={id}
          aria-expanded={isPlayrateActive}
        >
          Speed
          <span className={font('sans-bold', 0)}>{audioPlaybackRate}x</span>
        </TogglePlayRateButton>
        <PlayRateList id={id} $isActive={isPlayrateActive} $isDark={isDark}>
          <ul>
            {speeds.map(speed => {
              return (
                <PlayRateButton
                  key={speed}
                  $isDark={isDark}
                  onClick={() => updatePlaybackRate(speed)}
                >
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <span style={{ minWidth: '4em' }}>{speed}x</span>
                    {audioPlaybackRate === speed && (
                      <span
                        style={{ transform: 'scale(1.5)', display: 'flex' }}
                      >
                        <Icon icon={check} matchText={true} />
                      </span>
                    )}
                  </span>
                </PlayRateButton>
              );
            })}
          </ul>
        </PlayRateList>
      </PlayRateContainer>
    </FocusTrap>
  );
};

export default PlayRate;
