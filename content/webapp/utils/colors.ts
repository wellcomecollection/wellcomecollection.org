import { ColorSelection } from '../types/color-selections';

// Purple, Treal, Red and Green used to be offered in Prismic as options
// We should still support legacy stories so this function helps transform the colors
// Into the new ones
export const getSeriesColor = (
  prismicColor:
    | 'accent.blue'
    | 'accent.salmon'
    | 'accent.green'
    | 'accent.purple'
    | 'red'
    | 'green'
    | 'teal'
    | 'purple'
    | 'orange'
    | 'turquoise'
    | undefined
): ColorSelection => {
  switch (prismicColor) {
    case 'accent.blue':
    case 'accent.salmon':
    case 'accent.green':
    case 'accent.purple':
      return prismicColor;
    case 'teal':
    case 'turquoise':
      return 'accent.blue';
    case 'red':
    case 'orange':
      return 'accent.salmon';
    case 'green':
      return 'accent.green';
    case 'purple':
    default:
      return 'accent.purple';
  }
};
