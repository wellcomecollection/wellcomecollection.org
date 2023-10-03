import {
  ResultsLite,
  CollectionVenuePrismicDocumentLite,
} from '../../../server-data/prismic';
import { DayOfWeek, formatTime } from '@weco/common/utils/format-date';
import { Venue, OpeningHoursDay } from '@weco/common/model/opening-hours';
import {
  CollectionVenuePrismicDocument,
  DayField,
  ModifiedDayOpeningTime,
} from '../documents';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import * as prismic from '@prismicio/client';
import { transformImage } from './images';
import { transformTimestamp } from '.';

export function createRegularDay(
  day: DayOfWeek,
  venue: CollectionVenuePrismicDocument | CollectionVenuePrismicDocumentLite
): OpeningHoursDay {
  const { data } = venue;
  const lowercaseDay = day.toLowerCase();

  const dayField = data && (data[lowercaseDay] as DayField);

  const start =
    dayField[0]?.startDateTime &&
    transformTimestamp(dayField[0]?.startDateTime);
  const end =
    dayField[0]?.endDateTime && transformTimestamp(dayField[0]?.endDateTime);

  const isClosed = !start;
  // If there is no start time from prismic, then we set both opens and closes to 00:00.
  // This is necessary for the json-ld schema data, so Google knows when the venues are closed.
  // See https://developers.google.com/search/docs/advanced/structured-data/local-business#business-hours (All-day hours tab)
  // "To show a business is closed all day, set both opens and closes properties to '00:00'""
  return {
    dayOfWeek: day,
    opens: start ? formatTime(start) : '00:00',
    closes: start && end ? formatTime(end) : '00:00',
    isClosed,
  };
}

export function transformCollectionVenue(
  venue: CollectionVenuePrismicDocument | CollectionVenuePrismicDocumentLite
): Venue {
  const data = venue.data;
  const exceptionalOpeningHours = data.modifiedDayOpeningTimes
    ? data.modifiedDayOpeningTimes
        .filter((modified: ModifiedDayOpeningTime) => modified.overrideDate)
        .map(modified => {
          const start =
            modified.startDateTime &&
            transformTimestamp(modified.startDateTime);
          const end =
            modified.endDateTime && transformTimestamp(modified.endDateTime);
          const isClosed = !start;
          const overrideDate =
            modified.overrideDate && transformTimestamp(modified.overrideDate);
          const overrideType = modified.type ?? 'other';
          if (overrideDate) {
            return {
              overrideDate,
              overrideType,
              // If there is no start time from prismic, then we set both opens and closes to 00:00.
              // This is necessary for the json-ld schema data, so Google knows when the venues are closed.
              // See https://developers.google.com/search/docs/advanced/structured-data/local-business#business-hours (All-day hours tab)
              // "To show a business is closed all day, set both opens and closes properties to '00:00'""
              opens: start ? formatTime(start) : '00:00',
              closes: start && end ? formatTime(end) : '00:00',
              isClosed,
            };
          }
          return undefined;
        })
        .filter(isNotUndefined)
    : [];

  return {
    id: venue.id,
    order: data.order ?? undefined,
    name: data.title ?? '',
    openingHours: {
      regular: [
        createRegularDay('Monday', venue),
        createRegularDay('Tuesday', venue),
        createRegularDay('Wednesday', venue),
        createRegularDay('Thursday', venue),
        createRegularDay('Friday', venue),
        createRegularDay('Saturday', venue),
        createRegularDay('Sunday', venue),
      ],
      exceptional: exceptionalOpeningHours.filter(isNotUndefined),
    },
    image: 'image' in data ? transformImage(data.image) : undefined,
    url: 'link' in data && 'url' in data.link ? data.link.url : undefined,
    linkText: 'linkText' in data ? prismic.asText(data.linkText) : undefined,
  };
}

export function transformCollectionVenues(doc: ResultsLite): Venue[] {
  const venues = doc.results.map(venue => transformCollectionVenue(venue));

  return venues.sort((a, b) => {
    return Number(a.order) - Number(b.order);
  });
}
