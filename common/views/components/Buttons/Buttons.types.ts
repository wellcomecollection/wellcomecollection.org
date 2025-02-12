import { ReactNode } from 'react';

import { IconSvg } from '@weco/common/icons';
import { PaletteColor } from '@weco/common/views/themes/config';

export type ButtonSize = 'small' | 'medium';

export type SolidButtonStyledProps = {
  href?: string;
  $ariaLabel?: string;
  $size?: ButtonSize;
  $colors?: ButtonColors;
  $isPill?: boolean;
  $hasIcon?: boolean;
  $isIconAfter?: boolean;
};

export type ButtonColors = {
  border: PaletteColor;
  background: PaletteColor;
  text: PaletteColor;
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
  dataGtmTrigger?: string;
  dataTestId?: string;
  ariaLive?: 'off' | 'polite' | 'assertive';
  colors?: ButtonColors;
  isIconAfter?: boolean;
  size?: ButtonSize;
  form?: string;
  isPill?: boolean;
};
