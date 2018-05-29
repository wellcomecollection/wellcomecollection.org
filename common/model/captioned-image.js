// @flow

import type {Image} from './image';
import type {HTMLString} from '../services/prismic/types';

export type CpationedImage = {|
  caption: HTMLString,
  image: Image
|}
