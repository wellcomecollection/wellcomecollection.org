import { FocusTrap } from 'focus-trap-react';
import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { AppContext } from '@weco/common/views/components/AppContext';
import Space from '@weco/common/views/components/styled/Space';

const TogglePlayRateButton = styled.button.attrs({
  className: font('intr', 6),
})<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
  padding: 0;

  span {
    color: ${props => props.theme.color('yellow')};
    display: flex;
    justify-content: end;
    transition: color 0.2s ease-in-out;
  }

  &:hover span {
    color: ${props =>
      props.$isDark ? props.theme.color('white') : props.theme.color('black')};
  }
`;

const PlayRateButton = styled(Space).attrs<{ $isActive: boolean }>(props => ({
  as: 'button',
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  className: font(props.$isActive ? 'intsb' : 'intr', 6),
}))<{
  $isDark: boolean;
  $isActive?: boolean;
}>`
  display: flex;
  width: 100%;
  color: ${props =>
    props.$isActive
      ? props.theme.color('yellow')
      : props.$isDark
        ? props.theme.color('white')
        : props.theme.color('black')};

  &:hover {
    text-decoration: underline;
  }
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
  z-index: 2;
  border-radius: 8px 0 8px 8px;
  box-shadow: ${props => props.theme.basicBoxShadow};

  &[data-popper-placement='top'] {
    border-radius: 8px 8px 0;
  }

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
            offset: [-12, 10],
          },
        },
      ],
    }
  );

  const { audioPlaybackRate, setAudioPlaybackRate } = useContext(AppContext);
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
          <span className={font('intsb', 5)}>{audioPlaybackRate}x</span>
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
                  $isActive={audioPlaybackRate === speed}
                  $isDark={isDark}
                  onClick={() => updatePlaybackRate(speed)}
                >
                  {speed}x
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
