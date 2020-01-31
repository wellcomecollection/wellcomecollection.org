// @flow
import { useState, useEffect } from 'react';
import { type WorksUrlProps } from '../services/catalogue/params';

let savedState: ?WorksUrlProps;
export default function useSavedSearchState(initialState: WorksUrlProps) {
  const [state, setState] = useState<WorksUrlProps>(savedState || initialState);
  useEffect(() => {
    savedState = state;
  }, [state]);

  return [state, setState];
}
