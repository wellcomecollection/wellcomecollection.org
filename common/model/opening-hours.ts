import { Moment } from 'moment';

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
  overrideDate?: Moment;
  overrideType?: OverrideType;
};

export type ExceptionalPeriod = {
  type: OverrideType | null;
  dates: OverrideDate[];
};

export type OpeningHoursDay = {
  dayOfWeek: Day;
  opens?: string;
  closes?: string;
};

export type ExceptionalOpeningHoursDay = {
  overrideDate?: Moment;
  overrideType?: OverrideType;
  opens?: string;
  closes?: string;
};

export type OpeningHours = {
  regular: OpeningHoursDay[];
  exceptional: ExceptionalOpeningHoursDay[] | null;
};

export type Venue = {
  id: string;
  name: string;
  order?: number;
  openingHours: OpeningHours;
  url?: string;
  linkText?: string;
  image?: unknown;
};

export type PlacesOpeningHours = Venue[];

export type CollectionOpeningTimes = {
  placesOpeningHours: PlacesOpeningHours;
  upcomingExceptionalOpeningPeriods:
    | { dates: Moment[]; type: OverrideType }[]
    | null;
};

// http://schema.org/specialOpeningHoursSpecification
export type SpecialOpeningHours = {
  opens: string;
  closes: string;
  validFrom: Date;
  validThrough: Date;
};
