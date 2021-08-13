import { useEffect, useRef } from 'react';
import type { AgentConfigOptions, ApmBase } from '@elastic/apm-rum';

const useApmRum = (config?: AgentConfigOptions): ApmBase | undefined => {
  const apm = useRef<ApmBase>();
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
