import { spacing, font } from '../../../utils/classnames';
// TODO rename
import {
  parseVenueTimesToOpeningHours,
  backfillExceptionalVenueDays,
  getUpcomingExceptionalPeriod,
} from '../../../services/prismic/opening-times';

type Props = {|
  venue: any, // TODO
|};

const OpeningHoursTable = ({ venue }: Props) => {
  const venueData = parseVenueTimesToOpeningHours(venue);
  const upcomingPeriod = getUpcomingExceptionalPeriod(
    backfillExceptionalVenueDays(venueData)
  );
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
          {venueData.name}
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
          {venueData.openingHours.regular.map(day => (
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
      {venueData.openingHours.exceptional.length > 0 && (
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
            {venueData.name}
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
            {upcomingPeriod &&
              upcomingPeriod.map(days =>
                days.map(day => (
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
                ))
              )}
          </tbody>
        </table>
      )}
    </>
  );
};

export default OpeningHoursTable;
