import { BackgroundTexture } from '@weco/common/model/background-texture';
import { GenericContentFields } from './generic-content-fields';
import { Contributor } from './contributors';

export type EventSeries = GenericContentFields & {
  type: 'event-series';
  backgroundTexture?: BackgroundTexture;
  contributors: Contributor[];
};
