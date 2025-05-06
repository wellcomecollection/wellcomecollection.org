import { ApmBase } from '@elastic/apm-rum';
import getConfig from 'next/config';
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react';

import useApmRum from './useApmRum';

type ApmContextData = {
  apm?: ApmBase;
};

export const ApmContext = createContext<ApmContextData>({});

export function useApmContext(): ApmContextData {
  const contextState = useContext(ApmContext);
  return contextState;
}

const { publicRuntimeConfig } = getConfig();

export const ApmContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const apm = useApmRum(publicRuntimeConfig.apmConfig);
  return <ApmContext.Provider value={{ apm }}>{children}</ApmContext.Provider>;
};
