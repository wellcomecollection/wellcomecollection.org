import { createContext, useContext } from 'react';

type Props = {
  pageBackgroundColor: 'warmNeutral.300' | 'white';
};

const ContentPageContext = createContext<Props>({
  pageBackgroundColor: 'white',
});

export function useContentPageContext(): Props {
  const contextState = useContext(ContentPageContext);
  return contextState;
}

export default ContentPageContext;
