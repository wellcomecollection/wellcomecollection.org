import { useContext } from 'react';
import { spacing, font } from '../../../utils/classnames';
import {
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriod,
  exceptionalOpeningDates,
  exceptionalOpeningPeriods,
  exceptionalOpeningPeriodsAllDates,
} from '../../../services/prismic/opening-times';
import OpeningTimesContext from '@weco/common/views/components/OpeningTimesContext/OpeningTimesContext';

type Props = {|
  venue: Venue,
|};

const OpeningHoursTable = ({ venue }: Props) => {
  const openingTimes = useContext(OpeningTimesContext);
  // TODO names
  const a = exceptionalOpeningDates(openingTimes.collectionOpeningTimes);
  const b = a && exceptionalOpeningPeriods(a);
  const exceptionalPeriods = b && exceptionalOpeningPeriodsAllDates(b);
  const backfilled =
    exceptionalPeriods &&
    backfillExceptionalVenueDays(venue, exceptionalPeriods);
  const upcomingPeriod =
    backfilled.length > 0 ? getUpcomingExceptionalPeriod(backfilled) : [];

  return (
    <>
      <table
        className={`opening-hours__table ${font({ s: 'HNL5' })}
      `}
      >
        <caption
          className={`opening-hours__caption ${font({ s: 'HNM4' })} ${spacing(
            { s: 2 },
            { padding: ['top', 'bottom'] }
          )}`}
        >
          {venue.name}
        </caption>
        <thead className={`opening-hours__thead ${font({ s: 'HNM5' })}`}>
          <tr className="opening-hours__tr">
            <th
              scope="col"
              className={`opening-hours__th ${spacing(
                { s: 2 },
                { padding: ['top', 'bottom'] }
              )}`}
            >
              Day
            </th>
            <th
              scope="col"
              className={`opening-hours__th ${spacing(
                { s: 2 },
                { padding: ['top', 'bottom'] }
              )}`}
            >
              Times
            </th>
          </tr>
        </thead>
        <tbody className="opening-hours__tbody">
          {venue.openingHours.regular.map(day => (
            <tr key={day.dayOfWeek} className="opening-hours__tr">
              <td className="opening-hours__td">{day.dayOfWeek}</td>
              {day.opens ? (
                <td className="opening-hours__td">
                  {day.opens}&mdash;{day.closes}
                </td>
              ) : (
                <td className="opening-hours__td">Closed</td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {venue.openingHours.exceptional.length > 0 && (
        <table
          className={`opening-hours__table ${font({ s: 'HNL5' })}
    `}
        >
          <caption
            className={`opening-hours__caption ${font({ s: 'HNM4' })} ${spacing(
              { s: 2 },
              { padding: ['top', 'bottom'] }
            )}`}
          >
            {venue.name}
          </caption>
          <thead className={`opening-hours__thead ${font({ s: 'HNM5' })}`}>
            <tr className="opening-hours__tr">
              <th
                scope="col"
                className={`opening-hours__th ${spacing(
                  { s: 2 },
                  { padding: ['top', 'bottom'] }
                )}`}
              >
                Day
              </th>
              <th
                scope="col"
                className={`opening-hours__th ${spacing(
                  { s: 2 },
                  { padding: ['top', 'bottom'] }
                )}`}
              >
                Times
              </th>
            </tr>
          </thead>
          <tbody className="opening-hours__tbody">
            {upcomingPeriod.length > 0 &&
              upcomingPeriod[0].map(day => (
                <tr key={day.overrideDate} className="opening-hours__tr">
                  <td className="opening-hours__td">
                    {day.overrideDate.format('dddd, MMMM Do')}
                  </td>
                  {day.opens ? (
                    <td className="opening-hours__td">
                      {day.opens}&mdash;{day.closes}
                    </td>
                  ) : (
                    <td className="opening-hours__td">Closed</td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default OpeningHoursTable;
