import { ColorSelection } from '@weco/content/types/color-selections';

export const getSeriesColor = (
  prismicColor:
    | 'accent.blue'
    | 'accent.salmon'
    | 'accent.green'
    | 'accent.purple'
    | undefined
): ColorSelection => {
  switch (prismicColor) {
    case 'accent.blue':
    case 'accent.salmon':
    case 'accent.green':
    case 'accent.purple':
      return prismicColor;
    default:
      return 'accent.purple';
  }
};
