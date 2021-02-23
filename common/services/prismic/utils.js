// @flow
import moment from 'moment';
import { Predicates } from 'prismic-javascript';
import { london } from '../../utils/format-date';
import { getNextWeekendDateRange } from '../../utils/dates';
import type { Period } from '../../model/periods';
import {
  type GuideFormatId,
  GuideFormatIds,
} from '@weco/common/model/content-format-id';

type guideTypes = 'HowTo' | 'Topic' | 'LearningResource' | 'ExhibitionGuide';
function getKey(format: string): ?guideTypes {
  switch (true) {
    case format === 'how-to':
      return 'HowTo';
    case format === 'topic':
      return 'Topic';
    case format === 'learning-resource':
      return 'LearningResource';
    case format === 'exhibition-guide':
      return 'ExhibitionGuide';
  }
}

export function getGuideFormatId(formatQuery: string): ?GuideFormatId {
  const key = getKey(formatQuery);
  if (key) {
    return GuideFormatIds[key];
  }
}

export function getGuideFormatPredicates(formatQuery: string): Predicates[] {
  const formatId = getGuideFormatId(formatQuery);
  if (formatId) {
    return [Predicates.at('my.guides.format', formatId)];
  } else return [];
}

export function getPeriodPredicates(
  period: ?Period,
  startField: string,
  endField: string
): Predicates[] {
  const now = london(new Date());
  const startOfDay = moment().startOf('day');
  const endOfDay = moment().endOf('day');
  const weekendDateRange = getNextWeekendDateRange(now);
  const predicates =
    period === 'coming-up'
      ? [Predicates.dateAfter(startField, endOfDay.toDate())]
      : period === 'current-and-coming-up'
      ? [Predicates.dateAfter(endField, startOfDay.toDate())]
      : period === 'past'
      ? [Predicates.dateBefore(endField, startOfDay.toDate())]
      : period === 'today'
      ? [
          Predicates.dateBefore(startField, endOfDay.toDate()),
          Predicates.dateAfter(endField, startOfDay.toDate()),
        ]
      : period === 'this-weekend'
      ? [
          Predicates.dateBefore(startField, weekendDateRange.end),
          Predicates.dateAfter(endField, weekendDateRange.start),
        ]
      : period === 'this-week'
      ? [
          Predicates.dateBefore(startField, now.endOf('week').toDate()),
          Predicates.dateAfter(startField, now.startOf('week').toDate()),
        ]
      : period === 'next-seven-days'
      ? [
          Predicates.dateBefore(
            startField,
            now
              .add(6, 'days')
              .endOf('day')
              .toDate()
          ),
          Predicates.dateAfter(endField, startOfDay.toDate()),
        ]
      : [];

  return predicates;
}
