// @flow
type Place = {
  id: string;
  name: string;
  days: Array<Day>;
}
function place(data: Place) { return (data: Place); }

type Day = {
  name: string;
  hours: string;
}
function day(data: Day) { return (data: Day); }


export const defaultPlacesOpeningHours = [
  place({id: 'galleries', name: 'Galleries', days: [
    day({name: 'Monday',    hours: 'Galleries closed'}),
    day({name: 'Tuesday',   hours: '10:00 - 18:00'}),
    day({name: 'Wednesday', hours: '10:00 - 18:00'}),
    day({name: 'Thursday',  hours: '10:00 - 22:00'}),
    day({name: 'Friday',    hours: '10:00 - 18:00'}),
    day({name: 'Saturday',  hours: '10:00 - 18:00'}),
    day({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
  place({id: 'library', name: 'Library', days: [
    day({name: 'Monday',    hours: '10:00 - 18:00'}),
    day({name: 'Tuesday',   hours: '10:00 - 18:00'}),
    day({name: 'Wednesday', hours: '10:00 - 18:00'}),
    day({name: 'Thursday',  hours: '10:00 - 20:00'}),
    day({name: 'Friday',    hours: '10:00 - 18:00'}),
    day({name: 'Saturday',  hours: '10:00 - 16:00'}),
    day({name: 'Sunday',    hours: 'Library closed'})
  ]}),
  place({id: 'restaurant', name: 'Restaurant', days: [
    day({name: 'Monday',    hours: 'Restaurant closed'}),
    day({name: 'Tuesday',   hours: '11:00 - 18:00'}),
    day({name: 'Wednesday', hours: '11:00 - 18:00'}),
    day({name: 'Thursday',  hours: '11:00 - 22:00'}),
    day({name: 'Friday',    hours: '11:00 - 18:00'}),
    day({name: 'Saturday',  hours: '11:00 - 18:00'}),
    day({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
  place({id: 'café', name: 'Café', days: [
    day({name: 'Monday',    hours: '08:30 - 18:00'}),
    day({name: 'Tuesday',   hours: '08:30 - 18:00'}),
    day({name: 'Wednesday', hours: '08:30 - 18:00'}),
    day({name: 'Thursday',  hours: '08:30 - 22:00'}),
    day({name: 'Friday',    hours: '08:30 - 18:00'}),
    day({name: 'Saturday',  hours: '09:30 - 18:00'}),
    day({name: 'Sunday',    hours: '10:30 - 18:00'})
  ]}),
  place({id: 'shop', name: 'Shop', days: [
    day({name: 'Monday',    hours: '09:00 - 18:00'}),
    day({name: 'Tuesday',   hours: '09:00 - 18:00'}),
    day({name: 'Wednesday', hours: '09:00 - 18:00'}),
    day({name: 'Thursday',  hours: '09:00 - 22:00'}),
    day({name: 'Friday',    hours: '09:00 - 18:00'}),
    day({name: 'Saturday',  hours: '10:00 - 18:00'}),
    day({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
];
