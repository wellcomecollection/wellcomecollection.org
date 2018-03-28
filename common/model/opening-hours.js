// @flow
function createPlace(data: Place) { return (data: Place); }

type Days = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type OpeningHoursDay = {|
  dayOfWeek: Days,
  closes: string,
  opens?: string,
  note?: string
|};

export type ExceptionalOpeningHoursDay = {|
  ...OpeningHoursDay,
  overrideDate: Date,
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

export type Place = {|
  id: string,
  name: string,
  openingHours: OpeningHours
|};

export type ExceptionalVenueHours = {|
  exceptionalDate: Date,
  exceptionalDay: Days,
  id: string,
  name: string,
  openingHours: OpeningHoursDay | ExceptionalOpeningHoursDay,
  opensChanged: boolean,
  closesChanged: boolean
|};

export type PlacesOpeningHours = Array<Place>;

export const galleryOpeningHours: OpeningHours = {
  regular: [
    {dayOfWeek: 'Monday',    closes: '00:00', note: 'Galleries closed'},
    {dayOfWeek: 'Tuesday',   opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '10:00', closes: '22:00'},
    {dayOfWeek: 'Friday',    opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
  ],
  exceptional: [
    {overrideDate: new Date('2018-04-02'), dayOfWeek: 'Monday', opens: '10:00', closes: '18:00'}
  ]
};

export const libraryOpeningHours: OpeningHours = {
  regular: [
    {dayOfWeek: 'Monday',    opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Tuesday',   opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '10:00', closes: '20:00'},
    {dayOfWeek: 'Friday',    opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '10:00', closes: '16:00'},
    {dayOfWeek: 'Sunday',    closes: '00:00', note: 'Library closed'}
  ],
  exceptional: [
    {overrideDate: new Date('2018-03-30'),  dayOfWeek: 'Friday', closes: '00:00', note: 'Library closed'},
    {overrideDate: new Date('2018-03-31'),  dayOfWeek: 'Saturday', closes: '00:00', note: 'Library closed'},
    {overrideDate: new Date('2018-04-02'),  dayOfWeek: 'Monday', closes: '00:00', note: 'Library closed'}
  ]
};

export const restaurantOpeningHours: OpeningHours = {
  regular: [
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
  regular: [
    {dayOfWeek: 'Monday',    opens: '08:30', closes: '18:00'},
    {dayOfWeek: 'Tuesday',   opens: '08:30', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '08:30', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '08:30', closes: '22:00'},
    {dayOfWeek: 'Friday',    opens: '08:30', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '09:30', closes: '18:00'},
    {dayOfWeek: 'Sunday',    opens: '10:30', closes: '18:00'}
  ],
  exceptional: [
    {overrideDate: new Date('2018-03-30'), dayOfWeek: 'Friday', opens: '09:30', closes: '18:00'},
    {overrideDate: new Date('2018-04-02'), dayOfWeek: 'Monday', opens: '09:30', closes: '18:00'}
  ]
};

export const shopOpeningHours: OpeningHours = {
  regular: [
    {dayOfWeek: 'Monday',    opens: '09:00', closes: '18:00'},
    {dayOfWeek: 'Tuesday',   opens: '09:00', closes: '18:00'},
    {dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00'},
    {dayOfWeek: 'Thursday',  opens: '09:00', closes: '22:00'},
    {dayOfWeek: 'Friday',    opens: '09:00', closes: '18:00'},
    {dayOfWeek: 'Saturday',  opens: '10:00', closes: '18:00'},
    {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
  ],
  exceptional: [
    {overrideDate: new Date('2018-03-30'), dayOfWeek: 'Friday', opens: '10:00', closes: '18:00'},
    {overrideDate: new Date('2018-04-02'), dayOfWeek: 'Monday', opens: '10:00', closes: '18:00'}
  ]
};

export const placesOpeningHours: PlacesOpeningHours = [
  createPlace({id: 'galleries', name: 'Galleries', openingHours: galleryOpeningHours}),
  createPlace({id: 'library', name: 'Library', openingHours: libraryOpeningHours}),
  createPlace({id: 'restaurant', name: 'Restaurant', openingHours: restaurantOpeningHours}),
  createPlace({id: 'café', name: 'Café', openingHours: cafeOpeningHours}),
  createPlace({id: 'shop', name: 'Shop', openingHours: shopOpeningHours})
];
