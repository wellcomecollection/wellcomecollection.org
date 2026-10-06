import { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

import { IconSvg } from '@weco/common/icons';
import { DataGtmProps } from '@weco/common/utils/gtm';
import { PinnableColor } from '@weco/common/views/themes/config';
export type ButtonSize = 'small' | 'medium';

export type SolidButtonStyledProps = (
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
  | (ButtonHTMLAttributes<HTMLButtonElement> & { $isAnchorLink?: false })
) & {
  $ariaLabel?: string;
  $size?: ButtonSize;
  $colors?: ButtonColors;
  $isPill?: boolean;
  $hasIcon?: boolean;
  $isIconAfter?: boolean;
  $isNewSearchBar?: boolean;
  $hierarchy?: ButtonHierarchy;
  $isOnDark?: boolean;
};

/** Where a button sits in the brand designs' hierarchy. Only used when the
 * `brandUpdate` toggle is on.
 */
export type ButtonHierarchy = 'primary' | 'secondary' | 'tertiary';

export type ButtonColors = {
  border: PinnableColor;
  background: PinnableColor;
  text: PinnableColor;
  // The brand hierarchy a preset maps to, so buttons that don't pass
  // `hierarchy` still pick up the brand styles
  hierarchy?: ButtonHierarchy;
  isOnDark?: boolean;
};

export enum ButtonTypes {
  button = 'button',
  reset = 'reset',
  submit = 'submit',
}

export type ButtonSolidBaseProps = {
  text: ReactNode;
  icon?: IconSvg;
  type?: ButtonTypes;
  isTextHidden?: boolean;
  ariaControls?: string;
  ariaExpanded?: boolean;
  dataTestId?: string;
  dataGtmProps?: DataGtmProps;
  ariaLive?: 'off' | 'polite' | 'assertive';
  colors?: ButtonColors;
  isIconAfter?: boolean;
  size?: ButtonSize;
  form?: string;
  isPill?: boolean;
  hierarchy?: ButtonHierarchy;
  isOnDark?: boolean;
};
