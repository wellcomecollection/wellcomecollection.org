import { useState, useReducer, useEffect } from 'react';

const useScrollVelocity = (offset: number): number => {
  const [then, setThen] = useState(Date.now());
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [lastOffsets, lastOffsetsDispatch] = useReducer(
    (state, val) => [state[1], val],
    [0, 0]
  );
  const MILLISECONDS = 300;

  useEffect(() => {
    const now = Date.now();

    if (now > then + MILLISECONDS) {
      lastOffsetsDispatch(offset);
      setThen(now);
    }
  }, [offset, then]);

  useEffect(() => {
    const [a, b] = lastOffsets;
    const delta = Math.abs(a - b);
    const velocity = delta > 1000 ? 3 : delta > 500 ? 2 : delta > 0 ? 1 : 0;

    setScrollVelocity(velocity);
  }, [lastOffsets]);

  // Reset scrollVelocity to 0 (debounce);
  useEffect(() => {
    const handler = setTimeout(() => {
      setScrollVelocity(0);
    }, MILLISECONDS);

    return () => {
      clearTimeout(handler);
    };
  }, [offset]);

  return scrollVelocity;
};

export default useScrollVelocity;
