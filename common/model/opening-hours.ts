import { DayOfWeek } from '../utils/format-date';
import { ImageType } from './image';

export type OverrideType =
  | 'Bank holiday'
  | 'Easter'
  | 'Christmas and New Year'
  | 'Late Spectacular'
  | 'other';

export type HasOverrideDate = {
  overrideDate: Date;
};

export type OverrideDate = {
  overrideDate: Date;
  overrideType: OverrideType;
};

export type ExceptionalPeriod = {
  type: OverrideType;
  dates: Date[];
};

export type OpeningHoursDay = {
  dayOfWeek: DayOfWeek;
  opens: string;
  closes: string;
  isClosed?: boolean;
};

export type ExceptionalOpeningHoursDay = {
  overrideDate: Date;
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
  isFeatured?: boolean;
};

// http://schema.org/specialOpeningHoursSpecification
export type SpecialOpeningHours = {
  opens: string;
  closes: string;
  validFrom: Date | string;
  validThrough: Date | string;
};
