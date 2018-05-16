// @flow
import type {HTMLString} from '../services/prismic/types';
import type {BackgroundTexture} from './background-texture';
import type {ImagePromo} from './image-promo';

export type EventSeries = {|
  type: 'event-series',
  id: string,
  title: string,
  description: ?HTMLString,
  backgroundTexture: ?BackgroundTexture,
  promo: ?ImagePromo
|}
