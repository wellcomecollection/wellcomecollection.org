import { ColorSelection } from '../types/color-selections';

// Purple, Treal, Red and Green used to be offered in Prismic as options
// We should still support legacy stories so this function helps transform the colors
// Into the new ones
export const getSeriesColor = (
  prismicColor: 'teal' | 'red' | 'green' | 'purple' | undefined
): ColorSelection => {
  switch (prismicColor) {
    case 'teal':
      return 'accent.blue';
    case 'red':
      return 'accent.salmon';
    case 'green':
      return 'accent.green';
    case 'purple':
    default:
      return 'accent.purple';
  }
};
