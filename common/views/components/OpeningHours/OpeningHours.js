// @flow
import {spacing, font} from '../../../utils/classnames';
import {placesOpeningHours as places} from '../../../model/opening-hours';
import {Fragment} from 'react';
import moment from 'moment';
import {formatDate} from '../../../utils/format-date';

type Props = {|
  id: string,
  extraClasses?: string
|}

function london(d) {
  return moment.tz(d, 'Europe/London');
};

// TODO fix flow errors
const allExceptionalOpeningDates = places.map((place) => {
  if (place.openingHours.exceptional) {
    return place.openingHours.exceptional.map((openingTimes) => {
      return openingTimes.overrideDate;
    });
  }
})
  .filter(_ => _)
  .reduce(function(prev, curr) { // flatten
    return prev.concat(curr);
  })
  .sort(function(a, b) {
    return new Date(a) - new Date(b);
  })
  .filter(function(item, pos, ary) {
    return !pos || item.toString() !== ary[pos - 1].toString();
  });

// TODO lodash groupBy?
let groupedIndex = 0;

const exceptionalOpeningPeriods = allExceptionalOpeningDates.reduce((acc, date, i, array) => { // TODO explain purpose
  const earliestDate = acc[groupedIndex] ? london(acc[groupedIndex][0]) : london(date);
  const upperLimit = earliestDate.add(10, 'day');
  const currentDate = london(date);

  if (i === 0 || currentDate.isBefore(upperLimit, 'day')) {
    if (i === 0) {
      acc[groupedIndex] = [];
    }
    acc[groupedIndex].push(date);
  } else {
    groupedIndex++;
    acc[groupedIndex] = [];
    acc[groupedIndex].push(date);
  }

  return acc;
}, []);

const upcomingExceptionalOpeningPeriods = exceptionalOpeningPeriods.filter((dates) => {
  return london(dates[0]).isBefore(london().add(14, 'day'));
});

const OpeningHours = ({id, extraClasses}: Props) => (
  <Fragment>
    {upcomingExceptionalOpeningPeriods.length > 0 &&
      <p className={font({s: 'HNM4'})}>
        Please note unusual opening times will be in operation on
        {upcomingExceptionalOpeningPeriods.map((group, i, array) => {
          if (group.length > 1) {
            return (
              <span style={{'whiteSpace': 'nowrap'}} key={group[0]}>
                {(array.length > 1 && i > 0) && ', '}
                {` ${formatDate(new Date(group[0]))}`}&mdash;{`${formatDate(new Date(group[group.length - 1]))}`}
              </span>
            );
          } else {
            return (
              <span style={{'white-space': 'nowrap'}} key={group[0]}>
                {` ${formatDate(new Date(group[0]))}`}
              </span>
            );
          }
        })}
        {`. Please check our full opening times for details.`}
      </p>
    }
    <div className={`opening-hours ${extraClasses || ''} js-opening-hours js-tabs`}>
      <ul className={`plain-list opening-hours__tablist ${font({s: 'HNM6'})} ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['top', 'left', 'bottom', 'right']})} js-tablist`}>
        {places.map((place) => (
          <li key={place.id} className='opening-hours__tabitem js-tabitem'>
            <a className='opening-hours__tablink js-tablink' href={`#${id}-${place.id}`}>{place.name}</a>
          </li>
        ))}
      </ul>
      {places.map((place) => (
        <table key={`${id}-panel-${place.id}`} id={`${id}-panel-${place.id}`} className={`opening-hours__table ${font({s: 'HNL5'})} js-tabpanel`}>
          <caption className='opening-hours__caption js-tabfocus'>{place.name}</caption>
          <thead className='opening-hours__thead'>
            <tr className='opening-hours__tr'>
              <th scope='col'>Day</th>
              <th scope='col'>Times</th>
            </tr>
          </thead>
          <tbody className='opening-hours__tbody'>
            {place.openingHours.regular.map((day) => (
              <tr key={day.dayOfWeek} className='opening-hours__tr'>
                <td className='opening-hours__td'>{day.dayOfWeek}</td>
                {day.opens ? <td className='opening-hours__td'>{`${day.opens} - ${day.closes}`}</td> : <td className='opening-hours__td'>{day.note}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  </Fragment>
);

export default OpeningHours;
