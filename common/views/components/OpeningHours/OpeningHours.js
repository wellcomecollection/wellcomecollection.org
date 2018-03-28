// @flow
import {spacing, font} from '../../../utils/classnames';
import {placesOpeningHours as places} from '../../../model/opening-hours';
import {Fragment} from 'react';
import {formatDate} from '../../../utils/format-date';
import moment from 'moment';
import OpeningHoursTable from '../../components/OpeningHoursTable/OpeningHoursTable';
import {upcomingExceptionalDates} from '../../../services/opening-times';

type Props = {|
  id: string,
  extraClasses?: string
  |}

function london(d) {
  // $FlowFixMe
  return moment.tz(d, 'Europe/London');
};

const uniqueExceptionalOpeningDates = upcomingExceptionalDates;

let groupedIndex = 0;

const exceptionalOpeningPeriods = uniqueExceptionalOpeningDates && uniqueExceptionalOpeningDates.reduce((acc, date, i, array) => {
  const currentDate = london(date);
  const previousDate = array[i - 1] ? array[i - 1] : null;

  if (!previousDate) {
    acc[groupedIndex] = [];
    acc[groupedIndex].push(date);
  } else if (previousDate && currentDate.isBefore(london(previousDate).add(4, 'days'))) {
    acc[groupedIndex].push(date);
  } else {
    groupedIndex++;
    acc[groupedIndex] = [];
    acc[groupedIndex].push(date);
  }

  return acc;
}, []);

const upcomingExceptionalOpeningPeriods = exceptionalOpeningPeriods && exceptionalOpeningPeriods.filter((dates) => {
  const displayPeriodStart = london().subtract(1, 'day');
  const displayPeriodEnd = london().add(15, 'day');
  return london(dates[0]).isBetween(displayPeriodStart, displayPeriodEnd) || london(dates[dates.length - 1]).isBetween(displayPeriodStart, displayPeriodEnd);
});

const OpeningHours = ({id, extraClasses}: Props) => (
  <Fragment>
    {upcomingExceptionalOpeningPeriods && upcomingExceptionalOpeningPeriods.length > 0 &&
      <p className={font({s: 'HNM4'})}>
        Our opening times will change
        {upcomingExceptionalOpeningPeriods.map((group, i, array) => {
          const firstDate = group[0];
          const lastDate = group[group.length - 1];
          if (firstDate instanceof Date && lastDate instanceof Date) {
            if (group.length > 1) {
              return (
                <span key={group[0]}>
                  {(array.length > 1 && i > 0) && ', '}
                  {` between`} <span style={{'whiteSpace': 'nowrap'}}>{formatDate(firstDate)}</span>
                  &mdash;
                  <span style={{'whiteSpace': 'nowrap'}}>{formatDate(lastDate)}</span>
                </span>
              );
            } else {
              return (
                <Fragment>
                  {` on`} <span style={{'whiteSpace': 'nowrap'}} key={group[0]}>
                    {formatDate(firstDate)}
                  </span>
                </Fragment>
              );
            }
          }
        })}
        . Please check our <a href="/info/opening-times#exceptional">exceptional opening times</a> for details before you travel.
      </p>
    }
    <div className={`opening-hours ${extraClasses || ''} js-opening-hours js-tabs`}>
      <ul className={`plain-list opening-hours__tablist ${font({s: 'HNM6'})} ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['top', 'left', 'bottom', 'right']})} js-tablist`}>
        {places.map((place) => (
          <li key={place.id} className='opening-hours__tabitem js-tabitem'>
            <a className='opening-hours__tablink js-tablink' href={`#${id}-panel-${place.id}`}>{place.name}</a>
          </li>
        ))}
      </ul>
      {places.map((place) => (
        <OpeningHoursTable key={`${id}-panel-${place.id}`} id={id} place={place} />
      ))}
    </div>
  </Fragment>
);

export default OpeningHours;
