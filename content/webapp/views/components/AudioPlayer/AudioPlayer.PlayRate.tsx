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

const PlayRateList = styled.div<{
  $isDark: boolean;
}>`
  /* Reset popover UA styles */
  inset: unset;
  margin: 0;
  padding: 0;
  border: none;

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

  list-style: none;
  background-color: ${props =>
    props.$isDark
      ? props.theme.color('neutral.700')
      : props.theme.color('white')};
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
  const [isPlayRateActive, setIsPlayRateActive] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const { audioPlaybackRate, setAudioPlaybackRate } = useAppContext();
  const speeds = [0.5, 1, 1.5, 2];

  useEffect(() => {
    audioPlayer.playbackRate = audioPlaybackRate;
  }, [audioPlaybackRate]);

  useEffect(() => {
    audioPlayer.playbackRate = audioPlaybackRate;
  }, [id]);

  // Sync React state with popover toggle events (e.g. light-dismiss)
  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;

    function handleToggle(event: Event) {
      setIsPlayRateActive((event as ToggleEvent).newState === 'open');
    }

    el.addEventListener('toggle', handleToggle);
    return () => el.removeEventListener('toggle', handleToggle);
  }, []);

  function updatePlaybackRate(speed: number) {
    setAudioPlaybackRate(speed);
    audioPlayer.playbackRate = speed;
    popoverRef.current?.hidePopover();
  }

  function toggleShowHidePlayRate() {
    if (isPlayRateActive) {
      popoverRef.current?.hidePopover();
    } else {
      popoverRef.current?.showPopover();
    }
  }

  return (
    <FocusTrap
      active={isPlayRateActive}
      focusTrapOptions={{
        clickOutsideDeactivates: true,
      }}
    >
      <PlayRateContainer>
        <TogglePlayRateButton
          $isDark={isDark}
          onClick={toggleShowHidePlayRate}
          aria-controls={id}
          aria-expanded={isPlayRateActive}
        >
          Speed
          <span className={font('sans-bold', 0)}>{audioPlaybackRate}x</span>
        </TogglePlayRateButton>
        <PlayRateList
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore -- popover is not yet in React 18's HTMLAttributes
          popover="auto"
          ref={popoverRef}
          id={id}
          $isDark={isDark}
        >
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
