// @flow
import type {GenericContentFields} from './generic-content-fields';
import type {HTMLString} from '../services/prismic/types';
import type {BackgroundTexture} from './background-texture';

export type EventSeries = {|
  type: 'event-series',
  ...GenericContentFields,
  description: ?HTMLString,
  backgroundTexture: ?BackgroundTexture
|}
