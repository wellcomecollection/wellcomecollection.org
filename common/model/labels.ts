import { Pinnable } from '@weco/common/views/themes/config';

export type LabelColor = Pinnable<
  | 'accent.salmon'
  | 'yellow'
  | 'black'
  | 'warmNeutral.300'
  | 'white'
  | 'transparent'
>;

export type TextColor = Pinnable<'yellow' | 'black' | 'white'>;

export type Label = {
  text: string;
  labelColor?: LabelColor;
  textColor?: TextColor;
};
