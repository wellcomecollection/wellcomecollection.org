import { createContext } from 'react';
import { HTMLString } from '../../../../common/services/prismic/types';
type GlobalAlert = {
  isShown: string | null;
  routeRegex: string | null;
  text: HTMLString;
};
const GlobalAlertContext = createContext<GlobalAlert | null>(null);
export default GlobalAlertContext;
