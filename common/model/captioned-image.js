// @flow

import type {ImageType} from './image';
import type {HTMLString} from '../services/prismic/types';

export type CaptionedImage = {|
  caption: HTMLString,
  image: ImageType
|}
