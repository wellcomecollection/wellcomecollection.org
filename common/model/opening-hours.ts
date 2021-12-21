import { Moment } from 'moment';

export type Day = string; // 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

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
  image?: any; // TODO
};

export type PlacesOpeningHours = Venue[];

export type OpeningTimes = {
  placesOpeningHours: PlacesOpeningHours;
};

// http://schema.org/specialOpeningHoursSpecification
export type SpecialOpeningHours = {
  opens: string;
  closes: string;
  validFrom: Date;
  validThrough: Date;
};
