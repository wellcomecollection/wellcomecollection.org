import { ColorSelection } from '../types/color-selections';

// Purple, Treal, Red and Green used to be offered in Prismic as options
// We should still support legacy stories so this function helps transform the colors
// Into the new ones
export const getSeriesColor = (
  prismicColor: string | undefined
): ColorSelection => {
  let newColor = prismicColor;
  if (prismicColor === 'purple') newColor = 'accent.purple';
  if (prismicColor === 'teal') newColor = 'accent.blue';
  if (prismicColor === 'red') newColor = 'accent.salmon';
  if (prismicColor === 'green') newColor = 'accent.green';

  return newColor as ColorSelection;
};
