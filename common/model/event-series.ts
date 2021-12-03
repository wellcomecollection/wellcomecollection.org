import { GenericContentFields } from './generic-content-fields';
import { BackgroundTexture } from './background-texture';

export type EventSeries = GenericContentFields & {
  type: 'event-series';
  backgroundTexture?: BackgroundTexture;
};
