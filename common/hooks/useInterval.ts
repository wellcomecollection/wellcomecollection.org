import { useEffect, useRef } from 'react';
import { isNotUndefined } from '../utils/array';

type Callback = () => void;

const useInterval = (callback: Callback, delay: number | undefined) => {
  const savedCallback = useRef<Callback>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      if (savedCallback.current) {
        savedCallback.current!();
      }
    }
    if (isNotUndefined(delay)) {
      // Pause timer with a null delay.
      const id = setInterval(tick, delay);

      return () => clearInterval(id);
    }
  }, [delay]);
};

export default useInterval;
