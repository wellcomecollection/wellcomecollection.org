// @flow
import type {GenericContentFields} from './generic-content-fields';
import type {BackgroundTexture} from './background-texture';

export type EventSeries = {|
  type: 'event-series',
  ...GenericContentFields,
  backgroundTexture: ?BackgroundTexture
|}
