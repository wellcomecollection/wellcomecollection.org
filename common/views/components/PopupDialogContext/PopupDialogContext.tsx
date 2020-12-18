import { createContext } from 'react';
import { HTMLString, PrismicLink } from '../../../services/prismic/types';

export type PopupDialog = {
  isShown: boolean;
  openButtonText: string;
  title: string;
  text: HTMLString;
  linkText: string;
  link: PrismicLink;
};
const PopupDialogContext = createContext<PopupDialog | null>(null);

export default PopupDialogContext;
