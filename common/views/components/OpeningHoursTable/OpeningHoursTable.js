import {spacing, font} from '../../../utils/classnames';
import type {Place} from '../../../model/opening-hours';

type Props = {|
  id?: string,
  place: Place,
  extraClasses?: string
|}

const OpeningHoursTable = ({id, place, extraClasses}: Props) => (
  <table id={id && `${id}-panel-${place.id}`}
    className={`opening-hours__table ${font({s: 'HNL5'})}
    `}>
    <caption className={`opening-hours__caption ${font({s: 'HNM4'})} ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>{place.name}</caption>
    <thead className={`opening-hours__thead ${font({s: 'HNM5'})}`}>
      <tr className='opening-hours__tr'>
        <th scope='col' className={`opening-hours__th ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>Day</th>
        <th scope='col' className={`opening-hours__th ${spacing({s: 2}, {padding: ['top', 'bottom']})}`}>Times</th>
      </tr>
    </thead>
    <tbody className='opening-hours__tbody'>
      {place.openingHours.regular.map((day) => (
        <tr key={day.dayOfWeek} className='opening-hours__tr'>
          <td className='opening-hours__td'>{day.dayOfWeek}</td>
          {day.opens ? <td className='opening-hours__td'>{day.opens}&mdash;{day.closes}</td> : <td className='opening-hours__td'>Closed</td>}
        </tr>
      ))}
    </tbody>
  </table>
);

export default OpeningHoursTable;
