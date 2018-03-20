// @flow
function createPlace(data: Place) { return (data: Place); }

type Days = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type OpeningHoursDay = {
  dayOfWeek: Days,
  closes: string,
  opens?: string,
  note?: string
};

type ExceptionalOpeningHoursDay = OpeningHoursDay & {
  overrideDate: Date
}

export type OpeningHours = {
  openingHours: OpeningHoursDay[],
  exceptionalOpeningHours?: ExceptionalOpeningHoursDay[]
}

type Place = {|
  id: string,
  name: string,
  openingHours: OpeningHoursDay[],
|}

export type PlacesOpeningHours = Array<Place>;

export const galleryOpeningHours: OpeningHours = {
  openingHours: [
    {dayOfWeek: 'Monday',    closes: '00:00', note: 'Galleries closed'},
    {dayOfWeek: 'Tuesday',   opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '10:00', closes: '22:00'},
    {dayOfWeek: 'Friday',    opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
  ],
  exceptionalOpeningHours: [ // TODO check these dates, get more? - waiting on an email response
    {overrideDate: new Date('April 2, 2018'), dayOfWeek: 'Monday', opens: '10:00', closes: '17:00'},
    {overrideDate: new Date('May 7, 2018'), dayOfWeek: 'Monday', opens: '10:00', closes: '17:00'},
    {overrideDate: new Date('May 28, 2018'), dayOfWeek: 'Monday', opens: '10:00', closes: '17:00'},
    {overrideDate: new Date('December 25, 2018'),  dayOfWeek: 'Tuesday', closes: '00:00', note: 'Galleries closed'},
    {overrideDate: new Date('December 26, 2018'),  dayOfWeek: 'Wednesday', closes: '00:00', note: 'Galleries closed'}
  ]
};

export const libraryOpeningHours: OpeningHours = {
  openingHours: [
    {dayOfWeek: 'Monday',    opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Tuesday',   opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '10:00', closes: '20:00'},
    {dayOfWeek: 'Friday',    opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '10:00', closes: '16:00'},
    {dayOfWeek: 'Sunday',    closes: '00:00', note: 'Library closed'}
  ]
};

export const restaurantOpeningHours: OpeningHours = {
  openingHours: [
    {dayOfWeek: 'Monday',    closes: '00:00', note: 'Restaurant closed'},
    {dayOfWeek: 'Tuesday',   opens: '11:00', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '11:00', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '11:00', closes: '22:00'},
    {dayOfWeek: 'Friday',    opens: '11:00', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '11:00', closes: '18:00'},
    {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
  ]
};

export const cafeOpeningHours: OpeningHours = {
  openingHours: [
    {dayOfWeek: 'Monday',    opens: '08:30', closes: '18:00'},
    {dayOfWeek: 'Tuesday',   opens: '08:30', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '08:30', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '08:30', closes: '22:00'},
    {dayOfWeek: 'Friday',    opens: '08:30', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '09:30', closes: '18:00'},
    {dayOfWeek: 'Sunday',    opens: '10:30', closes: '18:00'}
  ]
};

export const shopOpeningHours: OpeningHours = {
  openingHours: [
    {dayOfWeek: 'Monday',    opens: '09:00', closes: '18:00'},
    {dayOfWeek: 'Tuesday',   opens: '09:00', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '09:00', closes: '22:00'},
    {dayOfWeek: 'Friday',    opens: '09:00', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
  ]
};

export const defaultPlacesOpeningHours: PlacesOpeningHours = [
  createPlace({id: 'galleries', name: 'Galleries', openingHours: galleryOpeningHours.openingHours}),
  createPlace({id: 'library', name: 'Library', openingHours: libraryOpeningHours.openingHours}),
  createPlace({id: 'restaurant', name: 'Restaurant', openingHours: restaurantOpeningHours.openingHours}),
  createPlace({id: 'café', name: 'Café', openingHours: cafeOpeningHours.openingHours}),
  createPlace({id: 'shop', name: 'Shop', openingHours: shopOpeningHours.openingHours})
];
