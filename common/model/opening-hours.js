// @flow
import type Moment from 'moment';

export type Days = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type OpeningHoursDay = {|
  dayOfWeek: Days,
  opens?: string,
  closes?: string
|};

export type ExceptionalOpeningHoursDay = {|
  overrideDate: any, // TODO moment
  opens?: string,
  closes?: string,
|}

// http://schema.org/specialOpeningHoursSpecification
export type SpecialOpeningHours = {|
  opens: string,
  closes: string,
  validFrom: Date,
  validThrough: Date
|}

export type OpeningHours = {|
  regular: OpeningHoursDay[],
  exceptional?: ?ExceptionalOpeningHoursDay[]
|};

export type Venue = {|
  id: string,
  name: string,
  order: number,
  openingHours: OpeningHours
|};

export type ExceptionalVenueHours = {|
  exceptionalDate: Date,
  exceptionalDay: Days,
  id: string,
  name: string,
  order: number,
  openingHours: OpeningHoursDay | ExceptionalOpeningHoursDay,
  opensChanged: boolean,
  closesChanged: boolean
|};

export type PlacesOpeningHours = Venue[];

export type OpeningTimes = {
  placesOpeningHours: PlacesOpeningHours,
  upcomingExceptionalOpeningPeriods: ?(Moment)[][],
  exceptionalOpeningHours: {
    [string]: ExceptionalVenueHours[]
  }
}

export const galleryOpeningHours: OpeningHours = { // TODO remove these once organization.js is using the gallery data from prismic
  regular: [
    {dayOfWeek: 'Monday'},
    {dayOfWeek: 'Tuesday',   opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '10:00', closes: '22:00'},
    {dayOfWeek: 'Friday',    opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
  ],
  exceptional: [
    {overrideDate: new Date('2018-04-02'), opens: '10:00', closes: '18:00'},
    {overrideDate: new Date('2018-05-07'), opens: '10:00', closes: '18:00'},
    {overrideDate: new Date('2018-05-28'), opens: '10:00', closes: '18:00'},
    {overrideDate: new Date('2018-08-27'), opens: '10:00', closes: '18:00'}
  ]
};
