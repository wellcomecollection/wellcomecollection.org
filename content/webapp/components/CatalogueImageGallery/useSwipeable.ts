import { RefObject, useEffect, useState } from 'react';

export type SwipeDirection = 'left' | 'right';

/**
 Listen to swipe events on `targetRef` and call `onSwipe` when a left/right swipe is detected.
 */
const useSwipeable = (
  targetRef: RefObject<HTMLElement | null>,
  onSwipe: (direction: SwipeDirection) => void,
  swipeDistanceThreshold = 50
) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const onTouchStart = e => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = e => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    if (Math.abs(touchStart - touchEnd) > swipeDistanceThreshold) {
      onSwipe(touchStart > touchEnd ? 'right' : 'left');
    }
  };

  useEffect(() => {
    if (!targetRef.current) return;

    targetRef.current.addEventListener('touchstart', onTouchStart);
    targetRef.current.addEventListener('touchmove', onTouchMove);
    targetRef.current.addEventListener('touchend', onTouchEnd);

    return () => {
      targetRef.current?.removeEventListener('touchstart', onTouchStart);
      targetRef.current?.removeEventListener('touchmove', onTouchMove);
      targetRef.current?.removeEventListener('touchend', onTouchEnd);
    };
  });
};

export default useSwipeable;
