import { FocusTrap } from 'focus-trap-react';
import { FunctionComponent, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { check } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';

const TogglePlayRateButton = styled.button.attrs({
  className: font('sans', -2),
})<{ $isDark: boolean }>`
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
  padding: ${props => props.theme.spacingUnits['4']}px;
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
  padding: ${props => props.theme.spacingUnits['3']}px 0;
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
  const [isPopperActive, setIsPopperActive] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null
  );

  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      placement: 'top',
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [-25, 10],
          },
        },
      ],
    }
  );

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
    setIsPopperActive(false);
  }

  function toggleShowHidePlayRate() {
    setIsPopperActive(!isPopperActive);

    if (update) {
      update();
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popperElement &&
        referenceElement &&
        !popperElement.contains(event.target as Node) &&
        !referenceElement.contains(event.target as Node)
      ) {
        setIsPopperActive(false);
      }
    }

    if (popperElement) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      if (popperElement) {
        document.removeEventListener('click', handleClickOutside);
      }
    };
  }, [popperElement, referenceElement]);

  return (
    <FocusTrap
      active={isPopperActive}
      focusTrapOptions={{
        clickOutsideDeactivates: true,
      }}
    >
      <div style={{ position: 'relative' }}>
        <TogglePlayRateButton
          $isDark={isDark}
          onClick={toggleShowHidePlayRate}
          ref={setReferenceElement}
          aria-controls={id}
          aria-expanded={isPopperActive}
        >
          Speed
          <span className={font('sans-bold', 0)}>{audioPlaybackRate}x</span>
        </TogglePlayRateButton>
        <PlayRateList
          id={id}
          $isActive={isPopperActive}
          $isDark={isDark}
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
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
      </div>
    </FocusTrap>
  );
};

export default PlayRate;
