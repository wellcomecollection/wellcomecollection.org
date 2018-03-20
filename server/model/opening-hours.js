// @flow
function createPlace(data: Place) { return (data: Place); }

type Days = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

type OpeningHoursDay = {|
  dayOfWeek: Days | Date,
  closes: string,
  opens?: string,
  note?: string
|};

export type OpeningHours = {
  openingHours: OpeningHoursDay[],
  exceptionalOpeningHours?: OpeningHoursDay[]
}

type Place = {|
  id: string,
  name: string,
  openingHours: OpeningHours,
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
    {dayOfWeek: new Date('April 2, 2018'),    opens: '10:00', closes: '17:00'},
    {dayOfWeek: new Date('May 7, 2018'),    opens: '10:00', closes: '17:00'},
    {dayOfWeek: new Date('May 28, 2018'),    opens: '10:00', closes: '17:00'},
    {dayOfWeek: new Date('December 25, 2018'),    closes: '00:00', note: 'Galleries closed'}
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
  createPlace({id: 'galleries', name: 'Galleries', openingHours: galleryOpeningHours}),
  createPlace({id: 'library', name: 'Library', openingHours: libraryOpeningHours}),
  createPlace({id: 'restaurant', name: 'Restaurant', openingHours: restaurantOpeningHours}),
  createPlace({id: 'café', name: 'Café', openingHours: cafeOpeningHours}),
  createPlace({id: 'shop', name: 'Shop', openingHours: shopOpeningHours})
];
