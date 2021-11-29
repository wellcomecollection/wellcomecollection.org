export type EditorialSeriesColour =
  | 'teal'
  | 'turquoise'
  | 'red'
  | 'green'
  | 'purple';

export type EditorialSeries = {
  name: string;
  description: string;
  colour: EditorialSeriesColour;
};
