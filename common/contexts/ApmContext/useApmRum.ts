import type { AgentConfigOptions, ApmBase } from '@elastic/apm-rum';
import { useEffect, useRef } from 'react';

const useApmRum = (config?: AgentConfigOptions): ApmBase | undefined => {
  const apm = useRef<ApmBase | undefined>(undefined);
  useEffect(() => {
    const initialiseApmRum = async () => {
      if (!apm.current) {
        const { init } = await import('@elastic/apm-rum');
        try {
          apm.current = init(config);
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
