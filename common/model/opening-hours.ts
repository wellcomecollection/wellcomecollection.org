import { Moment } from 'moment';
import { ImageType } from './image';

export type Day =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export type DayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type OverrideType =
  | 'Bank holiday'
  | 'Easter'
  | 'Christmas and New Year'
  | 'Late Spectacular'
  | 'other';

export type OverrideDate = {
  overrideDate: Moment;
  overrideType: OverrideType;
};

export type ExceptionalPeriod = {
  type: OverrideType;
  dates: Moment[];
};

export type OpeningHoursDay = {
  dayOfWeek: Day;
  opens: string;
  closes: string;
  isClosed?: boolean;
};

export type ExceptionalOpeningHoursDay = {
  overrideDate: Moment;
  overrideType: OverrideType;
  opens: string;
  closes: string;
  isClosed?: boolean;
};

export type OpeningHours = {
  regular: OpeningHoursDay[];
  exceptional: ExceptionalOpeningHoursDay[];
};

export type Venue = {
  id: string;
  openingHours: OpeningHours;
  order?: number;
  name: string;
  url?: string;
  linkText?: string;
  image?: ImageType;
};

// http://schema.org/specialOpeningHoursSpecification
export type SpecialOpeningHours = {
  opens: string;
  closes: string;
  validFrom: Date | string;
  validThrough: Date | string;
};
