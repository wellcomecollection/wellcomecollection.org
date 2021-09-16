// @flow
import type { Dayjs } from 'dayjs';
import type { ImageType } from './image';
import type { Link as LinkType } from './link';

export type Day = string; // 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type OverrideType =
  | 'Bank holiday'
  | 'Easter'
  | 'Christmas and New Year'
  | 'Late Spectacluar'
  | 'other';

export type OverrideDate = {|
  overrideDate: Dayjs,
  overrideType: ?OverrideType,
|};

export type ExceptionalPeriod = {|
  type: OverrideType,
  dates: OverrideDate[],
|};

export type OpeningHoursDay = {|
  dayOfWeek: Day,
  opens: ?string,
  closes: ?string,
|};

export type ExceptionalOpeningHoursDay = {|
  overrideDate: Dayjs,
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
  url?: LinkType,
  linkText?: ?string,
  image?: ImageType,
|};

export type PlacesOpeningHours = Venue[];

export type CollectionOpeningTimes = {
  placesOpeningHours: PlacesOpeningHours,
  upcomingExceptionalOpeningPeriods: ?({
    dates: Dayjs[],
    type: OverrideType,
  }[]),
};

// http://schema.org/specialOpeningHoursSpecification
export type SpecialOpeningHours = {|
  opens: string,
  closes: string,
  validFrom: Date,
  validThrough: Date,
|};
