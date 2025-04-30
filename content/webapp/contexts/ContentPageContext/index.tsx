import { createContext } from 'react';

type Props = {
  pageBackgroundColor: 'warmNeutral.300' | 'white';
};

const ContentPageContext = createContext<Props>({
  pageBackgroundColor: 'white',
});

export default ContentPageContext;
