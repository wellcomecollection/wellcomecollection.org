// @flow
import { useState, useEffect } from 'react';
import { type WorksRouteProps } from '../services/catalogue/routes';

let savedState: ?WorksRouteProps;
export default function useSavedSearchState(
  initialState: $Shape<WorksRouteProps>
) {
  const [state, setState] = useState<WorksRouteProps>(
    savedState || initialState
  );
  useEffect(() => {
    savedState = state;
  }, [state]);

  return [state, setState];
}
