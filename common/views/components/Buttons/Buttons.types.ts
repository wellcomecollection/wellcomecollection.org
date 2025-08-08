import { ReactNode } from 'react';

import { IconSvg } from '@weco/common/icons';
import { Url } from '@weco/common/model/link-props';
import { DataGtmProps } from '@weco/common/utils/gtm';
import { PaletteColor } from '@weco/common/views/themes/config';
export type ButtonSize = 'small' | 'medium';

export type SolidButtonStyledProps = {
  href?: string | Url;
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
  dataTestId?: string;
  dataGtmProps?: DataGtmProps;
  ariaLive?: 'off' | 'polite' | 'assertive';
  colors?: ButtonColors;
  isIconAfter?: boolean;
  size?: ButtonSize;
  form?: string;
  isPill?: boolean;
};
