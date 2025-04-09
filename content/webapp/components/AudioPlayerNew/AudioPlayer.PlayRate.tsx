import { FunctionComponent, useContext, useEffect, useState } from 'react';
import { usePopper } from 'react-popper';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import Space from '@weco/common/views/components/styled/Space';

const OpenSelectButton = styled.button.attrs({
  className: font('intr', 6),
})<{ $isDark: boolean }>`
  color: ${props =>
    props.$isDark ? props.theme.color('white') : props.theme.color('black')};
  padding: 0;

  span {
    display: flex;
    justify-content: end;
    color: ${props => props.theme.color('yellow')};
  }
`;

const PlayRateButton = styled.button.attrs<{ $isActive: boolean }>(props => ({
  className: font(props.$isActive ? 'intb' : 'intr', 6),
}))<{
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

  &:hover {
    text-decoration: underline;
  }
`;

const PlayRateList = styled(Space).attrs({
  as: 'ul',
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})<{ $isActive: boolean; $isDark: boolean }>`
  list-style: none;
  margin: 0;
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
  const [isSheetActive, setIsSheetActive] = useState(false);
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLUListElement | null>(
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

  function updatePlaybackRate(speed: number) {
    setAudioPlaybackRate(speed);
    audioPlayer.playbackRate = speed;
    setIsSheetActive(false);
  }

  function showSheet() {
    setIsSheetActive(true);

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
        setIsSheetActive(false);
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
    <div style={{ position: 'relative' }}>
      <OpenSelectButton
        $isDark={isDark}
        onClick={showSheet}
        ref={setReferenceElement}
      >
        speed
        <span>{audioPlaybackRate}x</span>
      </OpenSelectButton>
      <PlayRateList
        $isActive={isSheetActive}
        $isDark={isDark}
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
      >
        {speeds.map((speed, index) => {
          return (
            <Space
              $v={
                speeds.length === index + 1
                  ? undefined
                  : { size: 'm', properties: ['margin-bottom'] }
              }
              key={speed}
            >
              <PlayRateButton
                $isActive={audioPlaybackRate === speed}
                $isDark={isDark}
                onClick={() => updatePlaybackRate(speed)}
              >
                {speed}x
              </PlayRateButton>
            </Space>
          );
        })}
      </PlayRateList>
    </div>
  );
};

export default PlayRate;
