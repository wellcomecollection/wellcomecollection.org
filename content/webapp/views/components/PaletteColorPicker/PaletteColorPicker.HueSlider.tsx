import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';

import { clamp } from '@weco/content/utils/numeric';

type Props = {
  hue: number;
  onChangeHue: (value: number) => void;
};

const HueBar = styled.div`
  position: relative;
  width: 100%;
  height: 28px;
  background: linear-gradient(
    to right,
    #f00 0%,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    #f00 100%
  );
`;

type HandleProps = {
  $leftOffset: number;
};

const Handle = styled.span.attrs<HandleProps>(({ $leftOffset }) => ({
  style: {
    left: `${$leftOffset * 100}%`,
  },
}))<HandleProps>`
  display: inline-block;
  position: absolute;
  top: 50%;
  width: 6px;
  height: 24px;
  transform: translate(-50%, -50%);
  background-color: ${props => props.theme.color('white')};
  box-shadow: 0 0 1px rgb(0, 0, 0, 0.5);
  border-radius: 2px;
`;

type InteractionEvent = MouseEvent | TouchEvent;
type ReactInteractionEvent = React.MouseEvent | React.TouchEvent;

const isTouch = (e: InteractionEvent): e is TouchEvent => 'touches' in e;
const useIsomorphicLayoutEvent =
  typeof window === 'undefined' ? useEffect : useLayoutEffect;
const nKeyboardDetents = 50;

const getPosition = <T extends HTMLElement>(
  node: T,
  event: InteractionEvent
): number => {
  const { left, width } = node.getBoundingClientRect();
  const { pageX } = isTouch(event) ? event.touches[0] : event;
  return clamp((pageX - (left + window.pageXOffset)) / width);
};

const HueSlider: FunctionComponent<Props> = ({
  hue,
  onChangeHue,
  ...otherProps
}) => {
  const container = useRef<HTMLDivElement>(null);
  const hasTouched = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(hue / 360);

  // Prevent mobile from handling mouse events as well as touch
  const isValid = (event: InteractionEvent): boolean => {
    if (hasTouched.current && !isTouch(event)) {
      return false;
    }
    if (!hasTouched.current) {
      hasTouched.current = isTouch(event);
    }
    return true;
  };

  const handleMove = useCallback((event: InteractionEvent) => {
    event.preventDefault();
    const mouseIsDown = isTouch(event)
      ? event.touches.length > 0
      : event.buttons > 0;
    if (mouseIsDown && container.current) {
      const pos = getPosition(container.current, event);
      setPosition(pos);
    } else {
      setIsDragging(false);
    }
  }, []);

  const handleMoveStart = useCallback(
    ({ nativeEvent: event }: ReactInteractionEvent) => {
      event.preventDefault();
      if (isValid(event) && container.current) {
        const pos = getPosition(container.current, event);
        setPosition(pos);
        setIsDragging(true);
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const keyCode = parseInt(event.key, 10) || event.which || event.keyCode;
      if (keyCode === 39 /* right */ || keyCode === 37 /* left */) {
        event.preventDefault();
        const delta = (keyCode === 39 ? 360 : -360) / nKeyboardDetents;
        const nextValue = clamp(hue + delta, 0, 360);
        onChangeHue(nextValue);
      }
    },
    [hue, onChangeHue]
  );

  const handleMoveEnd = useCallback(() => {
    setIsDragging(false);
    onChangeHue(Math.round(position * 360));
  }, [onChangeHue, position]);

  const toggleDocumentEvents = useCallback(
    (attach: boolean) => {
      const toggleEvent = attach
        ? window.addEventListener
        : window.removeEventListener;
      toggleEvent(hasTouched.current ? 'touchmove' : 'mousemove', handleMove);
      toggleEvent(hasTouched.current ? 'touchend' : 'mouseup', handleMoveEnd);
    },
    [handleMove, handleMoveEnd]
  );

  useIsomorphicLayoutEvent(() => {
    toggleDocumentEvents(isDragging);
    return () => {
      if (isDragging) {
        toggleDocumentEvents(false);
      }
    };
  }, [isDragging, toggleDocumentEvents]);

  useEffect(() => {
    setPosition(hue / 360);
  }, [hue]);

  return (
    <HueBar
      ref={container}
      onTouchStart={handleMoveStart}
      onMouseDown={handleMoveStart}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="slider"
      aria-label="Hue"
      aria-valuetext={hue.toString()}
      {...otherProps}
    >
      <Handle $leftOffset={isDragging ? position : hue / 360} />
    </HueBar>
  );
};

export default HueSlider;
