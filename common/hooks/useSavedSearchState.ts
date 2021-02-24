import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { WorksProps } from '../views/components/WorksLink/WorksLink';

let savedState;
export default function useSavedSearchState(
  initialState: WorksProps
): [WorksProps, Dispatch<SetStateAction<WorksProps>>] {
  const [state, setState] = useState<WorksProps>(savedState || initialState);

  useEffect(() => {
    savedState = state;
  }, [state]);

  return [state, setState];
}
