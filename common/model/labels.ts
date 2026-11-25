import { DesignSystemColor } from '@weco/common/views/themes/config';

export type LabelColor =
  | DesignSystemColor
  | 'accent.salmon'
  | 'yellow'
  | 'black'
  | 'warmNeutral.300'
  | 'white'
  | 'transparent';

export type TextColor = DesignSystemColor | 'yellow' | 'black' | 'white';

export type Label = {
  text: string;
  labelColor?: LabelColor;
  textColor?: TextColor;
};
