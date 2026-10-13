import type { AgentConfigOptions, ApmBase } from '@elastic/apm-rum';
import { useEffect, useRef } from 'react';

// Takes a function rather than the config itself, as the config is read from
// the DOM and so is only available once we're running in the browser.
const useApmRum = (
  getConfig: () => AgentConfigOptions | undefined
): ApmBase | undefined => {
  const apm = useRef<ApmBase | undefined>(undefined);
  useEffect(() => {
    const initialiseApmRum = async () => {
      if (!apm.current) {
        const { init } = await import('@elastic/apm-rum');
        try {
          apm.current = init(getConfig());
        } catch (e) {
          console.error('Error initialising APM', e);
        }
      }
    };
    initialiseApmRum();
  }, []);

  return apm.current;
};

export default useApmRum;
