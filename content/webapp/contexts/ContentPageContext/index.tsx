import { createContext, useContext } from 'react';

import {
  pageBackgroundColor,
  Pinnable,
} from '@weco/common/views/themes/config';

type Props = {
  pageBackgroundColor: Pinnable<'warmNeutral.300' | 'white'>;
};

const ContentPageContext = createContext<Props>({
  pageBackgroundColor,
});

export function useContentPageContext(): Props {
  const contextState = useContext(ContentPageContext);
  return contextState;
}

export default ContentPageContext;
