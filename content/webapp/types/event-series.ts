import { EventSeriesDocumentDataBodySlice } from '@weco/common/prismicio-types';

import { Contributor } from './contributors';
import { GenericContentFields } from './generic-content-fields';

export type EventSeries =
  GenericContentFields<EventSeriesDocumentDataBodySlice> & {
    type: 'event-series';
    uid: string;
    contributors: Contributor[];
  };

export type EventSeriesBasic = {
  type: 'event-series';
  id: string;
  uid: string;
  title: string;
};
