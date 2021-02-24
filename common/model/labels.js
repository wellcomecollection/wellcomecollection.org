// @flow
export type LabelColor =
  | 'orange'
  | 'yellow'
  | 'black'
  | 'cream'
  | 'white'
  | 'transparent';
export type Label = {|
  url: ?string,
  text: string,
  labelColor?: LabelColor,
|};
