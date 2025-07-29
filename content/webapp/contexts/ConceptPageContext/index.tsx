import { createContext, useContext } from 'react';

import { ConceptConfig, defaultConceptConfig } from './concept.config';

type Props = {
  config: ConceptConfig;
};

const ConceptPageContext = createContext<Props>({
  config: defaultConceptConfig,
});

export function useConceptPageContext(): Props {
  const contextState = useContext(ConceptPageContext);
  return contextState;
}

export default ConceptPageContext;
