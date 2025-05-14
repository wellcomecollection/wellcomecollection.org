import { createContext, useContext } from 'react';

const IsArchiveContext = createContext<boolean>(false);

export function useIsArchiveContext(): boolean {
  const contextState = useContext(IsArchiveContext);
  return contextState;
}

export default IsArchiveContext;
