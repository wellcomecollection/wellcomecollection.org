// @flow
export type LabelColor =
  | 'orange'
  | 'yellow'
  | 'black'
  | 'cream'
  | 'white'
  | 'transparent';
export type Label = {|
  text: string,
  labelColor?: LabelColor,
|};
