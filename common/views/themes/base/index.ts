import { normalize } from './normalize';
import { wellcomeNormalize } from './wellcome-normalize';
import { layout } from './layout';
import { container } from './container';
import { row } from './row';
import { icons } from './icons';
import { inlineFonts } from './inline-fonts';
import { fonts } from './fonts';

export const base = [
  normalize,
  wellcomeNormalize,
  layout,
  container,
  row,
  icons,
  inlineFonts,
  fonts,
].join(' ');
