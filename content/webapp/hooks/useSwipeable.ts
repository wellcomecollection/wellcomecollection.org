import { RefObject, useEffect, useRef } from 'react';

export type SwipeDirection = 'left' | 'right';

/**
 Listen to swipe events on `targetRef` and call `onSwipe` when a left/right swipe is detected.
 */
const useSwipeable = (
  targetRef: RefObject<HTMLElement | null>,
  onSwipe: (direction: SwipeDirection) => void,
  swipeDistanceThreshold = 50
) => {
  const touchStartRef = useRef<number | null>(null);
  const touchEndRef = useRef<number | null>(null);
  const onSwipeRef = useRef(onSwipe);

  // Keep onSwipeRef current without re-registering listeners
  useEffect(() => {
    onSwipeRef.current = onSwipe;
  });

  useEffect(() => {
    const el = targetRef.current;
    if (!el) return;

    const onTouchStart = (event: TouchEvent) => {
      touchEndRef.current = null;
      touchStartRef.current = event.targetTouches[0].clientX;
    };

    const onTouchMove = (event: TouchEvent) => {
      touchEndRef.current = event.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
      const start = touchStartRef.current;
      const end = touchEndRef.current;
      if (!start || !end) return;

      if (Math.abs(start - end) > swipeDistanceThreshold) {
        onSwipeRef.current(start > end ? 'right' : 'left');
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [targetRef, swipeDistanceThreshold]);
};

export default useSwipeable;
