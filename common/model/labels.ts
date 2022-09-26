export type LabelColor =
  | 'accent.salmon'
  | 'yellow'
  | 'black'
  | 'warmNeutral.300'
  | 'white'
  | 'transparent';

export type TextColor = 'yellow' | 'black' | 'white';

export type Label = {
  text: string;
  labelColor?: LabelColor;
  textColor?: TextColor;
};
