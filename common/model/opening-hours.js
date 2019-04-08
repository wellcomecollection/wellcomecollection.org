// @flow
import type Moment from 'moment';

export type Day = string; // 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type OverrideType =
  | 'Bank holiday'
  | 'Easter'
  | 'Christmas and New Year'
  | 'Late Spectacluar'
  | 'other';

export type OverrideDate = {|
  overrideDate: Moment,
  overrideType: ?OverrideType,
|};

export type ExceptionalPeriod = {|
  type: OverrideType,
  dates: OverrideDate[],
|};

export type OpeningHoursDay = {|
  dayOfWeek: Day,
  opens?: ?string,
  closes?: ?string,
|};

export type ExceptionalOpeningHoursDay = {|
  overrideDate: Moment,
  overrideType: ?OverrideType,
  opens?: ?string,
  closes?: ?string,
|};

export type OpeningHours = {|
  regular: OpeningHoursDay[],
  exceptional: ?(ExceptionalOpeningHoursDay[]),
|};

export type Venue = {|
  id: string,
  name: string,
  order: number,
  openingHours: OpeningHours,
|};

export type PlacesOpeningHours = Venue[];

export type CollectionOpeningTimes = {
  placesOpeningHours: PlacesOpeningHours,
  upcomingExceptionalOpeningPeriods: ?({
    dates: Moment[],
    type: OverrideType,
  }[]),
};

export const galleryOpeningHours: OpeningHours = {
  // TODO remove these once organization.js is using the gallery data from prismic github issue #2476
  regular: [
    { dayOfWeek: 'Monday' },
    { dayOfWeek: 'Tuesday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Thursday', opens: '10:00', closes: '22:00' },
    { dayOfWeek: 'Friday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Saturday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Sunday', opens: '11:00', closes: '18:00' },
  ],
  exceptional: [],
};

export const libraryOpeningHours: OpeningHours = {
  // TODO remove these once organization.js is using the gallery data from prismic github issue #2476
  regular: [
    { dayOfWeek: 'Monday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Tuesday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Thursday', opens: '10:00', closes: '20:00' },
    { dayOfWeek: 'Friday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Saturday', opens: '10:00', closes: '18:00' },
    { dayOfWeek: 'Sunday' },
  ],
  exceptional: [],
};

// http://schema.org/specialOpeningHoursSpecification
export type SpecialOpeningHours = {|
  opens: string,
  closes: string,
  validFrom: Date,
  validThrough: Date,
|};
