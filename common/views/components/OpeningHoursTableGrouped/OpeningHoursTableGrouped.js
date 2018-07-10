import type {Venue} from '../../../model/opening-hours';
import {Fragment} from 'react';

type Props = {|
  venues: Venue[],
  extraClasses?: string
|}

function times(day, place) {
  const opensTime = place.openingHours.regular.find(times => times.dayOfWeek === day).opens;
  const closesTime = place.openingHours.regular.find(times => times.dayOfWeek === day).closes;
  return (
    <Fragment>
      {opensTime ? <span>{opensTime}&mdash;{closesTime}</span> : 'Closed'}
    </Fragment>
  );
}

function dayRows(venues) {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  return (
    days.map((day) => (
      <tr key={day} className='opening-hours__tr'>
        <th className='opening-hours__th' scope='row'
        ><abbr title={day}>{day.substring(0, 3)}</abbr></th>
        {venues && venues.map((place) => (
          <td key={place.name} scope='col' className='opening-hours__td'>
            {times(day, place)}
          </td>
        ))}
      </tr>
    ))
  );
}

const OpeningHoursTableGrouped = ({venues, extraClasses}: Props) => (
  <table className='opening-hours__table font-HNL5-s'>
    <thead className='opening-hours__th font-HNM5-s'>
      <tr className='opening-hours__tr'>
        <th scope='col' className='opening-hours__th opening-hours__th--row padding-top-s2 padding-bottom-s2'><span className='visually-hidden'>Day</span></th>
        {venues && venues.map((place) => (
          <th key={place.name} scope='col' className='opening-hours__th padding-top-s2 padding-bottom-s2'>{place.name}</th>
        ))}
      </tr>
    </thead>
    <tbody className='opening-hours__tbody'>
      {dayRows(venues)}
    </tbody>
  </table>
);

export default OpeningHoursTableGrouped;
