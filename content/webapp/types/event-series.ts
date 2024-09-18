import { BackgroundTexture } from '@weco/common/model/background-texture';

import { Contributor } from './contributors';
import { GenericContentFields } from './generic-content-fields';

export type EventSeries = GenericContentFields & {
  type: 'event-series';
  uid: string;
  backgroundTexture?: BackgroundTexture;
  contributors: Contributor[];
};

export type EventSeriesBasic = {
  id: string;
  uid: string;
  title: string;
};
