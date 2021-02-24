import { useState, useEffect, Dispatch, SetStateAction } from 'react';

let savedState;
export default function useSavedSearchState<T>(
  initialState: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(savedState || initialState);

  useEffect(() => {
    savedState = state;
  }, [state]);

  return [state, setState];
}
