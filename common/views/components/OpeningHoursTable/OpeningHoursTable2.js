import { spacing, font } from '../../../utils/classnames';
import type { Place } from '../../../model/opening-hours';
// import { london } from '../../../utils/format-date';

type Props = {|
  id?: string,
  place: Place,
  extraClasses?: string,
|};

const OpeningHoursTable = ({ id, place, extraClasses }: Props) => {
  // const upcomingExceptionalDays = place.openingHours.exceptional;
  // .reduce(
  //   (acc, day) => {
  //     // TODO order the array by date?
  //     const isCloseDate = acc.find(upcomingDay => {
  //       console.log(upcomingDay);
  //       return day.overrideDate.isBetween(
  //         upcomingDay.overrideDate.clone().subtract(14, 'days'),
  //         upcomingDay.overrideDate.clone().subtract(14, 'days'),
  //         'day'
  //       );
  //     });
  //     console.log(
  //       london()
  //         .clone()
  //         .subtract(382, 'days')
  //     );
  //     if (
  //       isCloseDate ||
  //       (day.overrideDate.isSameOrAfter(
  //         london()
  //           .clone()
  //           .subtract(382, 'days'),
  //         'day'
  //       ) &&
  //         day.overrideDate.isSameOrBefore(
  //           london()
  //             .clone()
  //             .subtract(382, 'days')
  //             .add(14, 'days'),
  //           'day'
  //         ))
  //     ) {
  //       acc.push(day);
  //     }
  //     return acc;
  //   },
  //   []
  // );
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
          {place.name}
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
          {place.openingHours.regular.map(day => (
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
      {place.openingHours.exceptional.length > 0 && (
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
            {place.name}
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
            {place.openingHours.exceptional.map(day => (
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
