// @flow
type Place = {
  id: string;
  name: string;
  days: Array<Day>;
}
function createPlace(data: Place) { return (data: Place); }

type Day = {
  name: string;
  hours: string;
}
function createDay(data: Day) { return (data: Day); }

export type PlacesOpeningHours = Array<Place>;


export const defaultPlacesOpeningHours: PlacesOpeningHours = [
  createPlace({id: 'galleries', name: 'Galleries', days: [
    createDay({name: 'Monday',    hours: 'Galleries closed'}),
    createDay({name: 'Tuesday',   hours: '10:00 - 18:00'}),
    createDay({name: 'Wednesday', hours: '10:00 - 18:00'}),
    createDay({name: 'Thursday',  hours: '10:00 - 22:00'}),
    createDay({name: 'Friday',    hours: '10:00 - 18:00'}),
    createDay({name: 'Saturday',  hours: '10:00 - 18:00'}),
    createDay({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
  createPlace({id: 'library', name: 'Library', days: [
    createDay({name: 'Monday',    hours: '10:00 - 18:00'}),
    createDay({name: 'Tuesday',   hours: '10:00 - 18:00'}),
    createDay({name: 'Wednesday', hours: '10:00 - 18:00'}),
    createDay({name: 'Thursday',  hours: '10:00 - 20:00'}),
    createDay({name: 'Friday',    hours: '10:00 - 18:00'}),
    createDay({name: 'Saturday',  hours: '10:00 - 16:00'}),
    createDay({name: 'Sunday',    hours: 'Library closed'})
  ]}),
  createPlace({id: 'restaurant', name: 'Restaurant', days: [
    createDay({name: 'Monday',    hours: 'Restaurant closed'}),
    createDay({name: 'Tuesday',   hours: '11:00 - 18:00'}),
    createDay({name: 'Wednesday', hours: '11:00 - 18:00'}),
    createDay({name: 'Thursday',  hours: '11:00 - 22:00'}),
    createDay({name: 'Friday',    hours: '11:00 - 18:00'}),
    createDay({name: 'Saturday',  hours: '11:00 - 18:00'}),
    createDay({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
  createPlace({id: 'café', name: 'Café', days: [
    createDay({name: 'Monday',    hours: '08:30 - 18:00'}),
    createDay({name: 'Tuesday',   hours: '08:30 - 18:00'}),
    createDay({name: 'Wednesday', hours: '08:30 - 18:00'}),
    createDay({name: 'Thursday',  hours: '08:30 - 22:00'}),
    createDay({name: 'Friday',    hours: '08:30 - 18:00'}),
    createDay({name: 'Saturday',  hours: '09:30 - 18:00'}),
    createDay({name: 'Sunday',    hours: '10:30 - 18:00'})
  ]}),
  createPlace({id: 'shop', name: 'Shop', days: [
    createDay({name: 'Monday',    hours: '09:00 - 18:00'}),
    createDay({name: 'Tuesday',   hours: '09:00 - 18:00'}),
    createDay({name: 'Wednesday', hours: '09:00 - 18:00'}),
    createDay({name: 'Thursday',  hours: '09:00 - 22:00'}),
    createDay({name: 'Friday',    hours: '09:00 - 18:00'}),
    createDay({name: 'Saturday',  hours: '10:00 - 18:00'}),
    createDay({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
];
