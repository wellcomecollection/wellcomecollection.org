import { createContext, useContext } from 'react';

import { ConceptConfig } from './concept.config';

type Props = {
  config?: ConceptConfig;
};

const ConceptPageContext = createContext<Props>({
  config: undefined,
});

export function useConceptPageContext(): Props {
  const contextState = useContext(ConceptPageContext);
  return contextState;
}

export default ConceptPageContext;
