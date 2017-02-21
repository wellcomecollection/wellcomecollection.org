// @flow
type Place = {|
  id: string;
  name: string;
  openingHours: OpeningHours;
|}
function createPlace(data: Place) { return (data: Place); }

export type PlacesOpeningHours = Array<Place>;

type OpeningHoursDay = {|
  dayOfWeek: string,
  closes: string,
  opens?: string,
  note?: string
|};

export type OpeningHours = Array<OpeningHoursDay>;

export const galleryOpeningHours: OpeningHours = [
  {dayOfWeek: 'Monday',    closes: '00:00', note: 'Galleries closed'},
  {dayOfWeek: 'Tuesday',   opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Thursday',  opens: '10:00', closes: '22:00'},
  {dayOfWeek: 'Friday',    opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Saturday',  opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
];

export const libraryOpeningHours: OpeningHours = [
  {dayOfWeek: 'Monday',    opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Tuesday',   opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Wednesday', opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Thursday',  opens: '10:00', closes: '20:00'},
  {dayOfWeek: 'Friday',    opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Saturday',  opens: '10:00', closes: '16:00'},
  {dayOfWeek: 'Sunday',    closes: '00:00', note: 'Library closed'}
];

export const restaurantOpeningHours: OpeningHours = [
  {dayOfWeek: 'Monday',    closes: '00:00', note: 'Restaurant closed'},
  {dayOfWeek: 'Tuesday',   opens: '11:00', closes: '18:00'},
  {dayOfWeek: 'Wednesday', opens: '11:00', closes: '18:00'},
  {dayOfWeek: 'Thursday',  opens: '11:00', closes: '22:00'},
  {dayOfWeek: 'Friday',    opens: '11:00', closes: '18:00'},
  {dayOfWeek: 'Saturday',  opens: '11:00', closes: '18:00'},
  {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
];

export const cafeOpeningHours: OpeningHours = [
  {dayOfWeek: 'Monday',    opens: '08:30', closes: '18:00'},
  {dayOfWeek: 'Tuesday',   opens: '08:30', closes: '18:00'},
  {dayOfWeek: 'Wednesday', opens: '08:30', closes: '18:00'},
  {dayOfWeek: 'Thursday',  opens: '08:30', closes: '22:00'},
  {dayOfWeek: 'Friday',    opens: '08:30', closes: '18:00'},
  {dayOfWeek: 'Saturday',  opens: '09:30', closes: '18:00'},
  {dayOfWeek: 'Sunday',    opens: '10:30', closes: '18:00'}
];

export const shopOpeningHours: OpeningHours = [
  {dayOfWeek: 'Monday',    opens: '09:00', closes: '18:00'},
  {dayOfWeek: 'Tuesday',   opens: '09:00', closes: '18:00'},
  {dayOfWeek: 'Wednesday', opens: '09:00', closes: '18:00'},
  {dayOfWeek: 'Thursday',  opens: '09:00', closes: '22:00'},
  {dayOfWeek: 'Friday',    opens: '09:00', closes: '18:00'},
  {dayOfWeek: 'Saturday',  opens: '10:00', closes: '18:00'},
  {dayOfWeek: 'Sunday',    opens: '11:00', closes: '18:00'}
];


export const defaultPlacesOpeningHours: PlacesOpeningHours = [
  createPlace({id: 'galleries', name: 'Galleries', openingHours: galleryOpeningHours}),
  createPlace({id: 'library', name: 'Library', openingHours: libraryOpeningHours}),
  createPlace({id: 'restaurant', name: 'Restaurant', openingHours: restaurantOpeningHours}),
  createPlace({id: 'café', name: 'Café', openingHours: cafeOpeningHours}),
  createPlace({id: 'shop', name: 'Shop', openingHours: shopOpeningHours}),
];
