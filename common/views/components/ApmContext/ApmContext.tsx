import { ApmBase } from '@elastic/apm-rum';
import getConfig from 'next/config';
import { createContext, FunctionComponent } from 'react';
import useApmRum from './useApmRum';

type ApmContextData = {
  apm?: ApmBase;
};

export const ApmContext = createContext<ApmContextData>({});

const { publicRuntimeConfig } = getConfig();

export const ApmContextProvider: FunctionComponent = ({ children }) => {
  const apm = useApmRum({
    serviceName: process.env.NEXT_PUBLIC_APM_SERVICE_NAME,
    ...publicRuntimeConfig.apmConfig,
  });
  return <ApmContext.Provider value={{ apm }}>{children}</ApmContext.Provider>;
};
