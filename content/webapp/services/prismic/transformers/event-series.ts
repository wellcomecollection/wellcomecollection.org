import { EventSeriesDocument as RawEventSeriesDocument } from '@weco/common/prismicio-types';
import {
  EventSeries,
  EventSeriesBasic,
} from '@weco/content/types/event-series';

import { transformGenericFields } from '.';
import { transformContributors } from './contributors';

export function transformEventSeries(
  document: RawEventSeriesDocument
): EventSeries {
  const genericFields = transformGenericFields(document);

  const labels = [{ text: 'Event series' }];

  const contributors = transformContributors(document);

  return {
    ...genericFields,
    type: 'event-series',
    uid: document.uid,
    labels,
    contributors,
  };
}

export function transformEventSeriesToEventSeriesBasic(
  eventSeries: EventSeries
): EventSeriesBasic {
  return (({ id, uid, title, type }) => ({
    id,
    uid,
    type,
    title,
  }))(eventSeries);
}
