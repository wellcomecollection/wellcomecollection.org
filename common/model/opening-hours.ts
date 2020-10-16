import { Moment } from 'moment';
import { ImageType } from './image';
import { Link as LinkType } from './link';

export type Day = string; // 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type OverrideType =
  | 'Bank holiday'
  | 'Easter'
  | 'Christmas and New Year'
  | 'Late Spectacluar'
  | 'other';

export type OverrideDate = {
  overrideDate: Moment,
  overrideType: OverrideType | null,
};

export type ExceptionalPeriod = {
  type: OverrideType | null,
  dates: OverrideDate[],
};

export type OpeningHoursDay = {
  dayOfWeek: Day,
  opens: string | null,
  closes: string | null,
};

export type ExceptionalOpeningHoursDay = {
  overrideDate: Moment,
  overrideType: OverrideType,
  opens: string | null,
  closes: string | null,
};

export type OpeningHours = {
  regular: OpeningHoursDay[],
  exceptional: ExceptionalOpeningHoursDay[] | null,
};

export type Venue = {
  id: string,
  name: string,
  order: number,
  openingHours: OpeningHours,
  url?: LinkType,
  linkText?: string | null,
  image?: ImageType,
};

export type PlacesOpeningHours = Venue[];

export type CollectionOpeningTimes = {
  placesOpeningHours: PlacesOpeningHours,
  upcomingExceptionalOpeningPeriods: { dates: Moment[]; type: OverrideType; }[] | null,
};

// http://schema.org/specialOpeningHoursSpecification
export type SpecialOpeningHours = {
  opens: string,
  closes: string,
  validFrom: Date,
  validThrough: Date,
};
