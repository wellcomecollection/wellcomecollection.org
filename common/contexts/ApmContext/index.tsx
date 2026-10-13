import type { AgentConfigOptions, ApmBase } from '@elastic/apm-rum';
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

// The client APM config depends on env vars that are only set at runtime (they
// differ between stage and prod, which share a build), so _document writes it
// into the page as JSON and we read it back here in the browser.
export const apmConfigScriptId = 'apm-config';

const readApmConfig = (): AgentConfigOptions | undefined => {
  const script = document.getElementById(apmConfigScriptId);
  if (!script?.textContent) return undefined;

  try {
    return JSON.parse(script.textContent);
  } catch (e) {
    console.error('Error reading APM config', e);
    return undefined;
  }
};

export const ApmContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const apm = useApmRum(readApmConfig);
  return <ApmContext.Provider value={{ apm }}>{children}</ApmContext.Provider>;
};
