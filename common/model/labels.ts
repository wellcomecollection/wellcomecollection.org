export type LabelColor =
  | 'orange'
  | 'yellow'
  | 'black'
  | 'cream'
  | 'white'
  | 'transparent';
export type Label = {
  url: string | null;
  text: string;
  labelColor?: LabelColor;
};
