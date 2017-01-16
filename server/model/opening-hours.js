import {Record} from 'immutable';

const Place = Record({
  id: null,
  name: null,
  days: []
});

const Day = Record({
  name: null,
  hours: null
});

export const defaultPlacesOpeningHours = [
  new Place({id: 'galleries', name: 'Galleries', days: [
    new Day({name: 'Monday',    hours: 'Galleries closed'}),
    new Day({name: 'Tuesday',   hours: '10:00 - 18:00'}),
    new Day({name: 'Wednesday', hours: '10:00 - 18:00'}),
    new Day({name: 'Thursday',  hours: '10:00 - 22:00'}),
    new Day({name: 'Friday',    hours: '10:00 - 18:00'}),
    new Day({name: 'Saturday',  hours: '10:00 - 18:00'}),
    new Day({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
  new Place({id: 'library', name: 'Library', days: [
    new Day({name: 'Monday',    hours: '10:00 - 18:00'}),
    new Day({name: 'Tuesday',   hours: '10:00 - 18:00'}),
    new Day({name: 'Wednesday', hours: '10:00 - 18:00'}),
    new Day({name: 'Thursday',  hours: '10:00 - 20:00'}),
    new Day({name: 'Friday',    hours: '10:00 - 18:00'}),
    new Day({name: 'Saturday',  hours: '10:00 - 16:00'}),
    new Day({name: 'Sunday',    hours: 'Library closed'})
  ]}),
  new Place({id: 'restaurant', name: 'Restaurant', days: [
    new Day({name: 'Monday',    hours: 'Restaurant closed'}),
    new Day({name: 'Tuesday',   hours: '11:00 - 18:00'}),
    new Day({name: 'Wednesday', hours: '11:00 - 18:00'}),
    new Day({name: 'Thursday',  hours: '11:00 - 22:00'}),
    new Day({name: 'Friday',    hours: '11:00 - 18:00'}),
    new Day({name: 'Saturday',  hours: '11:00 - 18:00'}),
    new Day({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
  new Place({id: 'café', name: 'Café', days: [
    new Day({name: 'Monday',    hours: '08:30 - 18:00'}),
    new Day({name: 'Tuesday',   hours: '08:30 - 18:00'}),
    new Day({name: 'Wednesday', hours: '08:30 - 18:00'}),
    new Day({name: 'Thursday',  hours: '08:30 - 22:00'}),
    new Day({name: 'Friday',    hours: '08:30 - 18:00'}),
    new Day({name: 'Saturday',  hours: '09:30 - 18:00'}),
    new Day({name: 'Sunday',    hours: '10:30 - 18:00'})
  ]}),
  new Place({id: 'shop', name: 'Shop', days: [
    new Day({name: 'Monday',    hours: '09:00 - 18:00'}),
    new Day({name: 'Tuesday',   hours: '09:00 - 18:00'}),
    new Day({name: 'Wednesday', hours: '09:00 - 18:00'}),
    new Day({name: 'Thursday',  hours: '09:00 - 22:00'}),
    new Day({name: 'Friday',    hours: '09:00 - 18:00'}),
    new Day({name: 'Saturday',  hours: '10:00 - 18:00'}),
    new Day({name: 'Sunday',    hours: '11:00 - 18:00'})
  ]}),
];
