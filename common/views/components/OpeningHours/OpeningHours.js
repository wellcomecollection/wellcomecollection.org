// @flow
import {spacing, font} from '../../../utils/classnames';
import { defaultPlacesOpeningHours as places } from '../../../model/opening-hours';

type Props = {|
  id: string,
  extraClasses: string
|}

const OpeningHours = ({id, extraClasses}: Props) => (
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
          {place.openingHours.map((day) => (
            <tr key={day.dayOfWeek} className='opening-hours__tr'>
              <td className='opening-hours__td'>{day.dayOfWeek}</td>
              {day.opens ? <td className='opening-hours__td'>{`${day.opens} - ${day.closes}`}</td> : <td className='opening-hours__td'>{day.note}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    ))}
  </div>
);

export default OpeningHours;
