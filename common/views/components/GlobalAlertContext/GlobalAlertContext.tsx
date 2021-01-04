import { createContext } from 'react';
import { HTMLString } from '../../../services/prismic/types';
export type GlobalAlert = {
  isShown: string | null;
  routeRegex: string | null;
  text: HTMLString;
};
const GlobalAlertContext = createContext<GlobalAlert | null>(null);
export default GlobalAlertContext;
