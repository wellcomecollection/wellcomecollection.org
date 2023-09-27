import { useState, useEffect } from 'react';

export function useControlledState<T>(
  controlledValue: T
): [T, (val: T) => void] {
  const [stateValue, setStateValue] = useState(controlledValue);

  useEffect(() => {
    if (controlledValue !== stateValue) {
      setStateValue(controlledValue);
    }
  }, [controlledValue]);

  return [stateValue, setStateValue];
}
