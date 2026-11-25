import { createContext, useContext } from 'react';

import { pageBackgroundColor } from '@weco/common/views/themes/config';

type Props = {
  pageBackgroundColor: 'warmNeutral.300' | typeof pageBackgroundColor;
};

const ContentPageContext = createContext<Props>({
  pageBackgroundColor,
});

export function useContentPageContext(): Props {
  const contextState = useContext(ContentPageContext);
  return contextState;
}

export default ContentPageContext;
