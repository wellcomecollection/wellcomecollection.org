// @flow

import {grid, font, spacing} from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import Author from '../Author/Author';
import MoreInfoLink from '../MoreInfoLink/MoreInfoLink';
import ButtonButton from '../Buttons/ButtonButton/ButtonButton';

const EventScheduleItem = () => (
  <li className={`event-schedule__item drawer js-show-hide ${spacing({s: 4}, {margin: ['bottom']})}`}>
    <button className='event-schedule__trigger plain-button no-margin no-padding pointer js-show-hide-trigger'>
      <div className='grid'>
        <div className={`${grid({s: 12, m: 12, l: 2, xl: 2})} ${spacing({s: 2}, {margin: ['bottom']})} ${spacing({l: 0}, {margin: ['bottom']})} event-schedule__border event-schedule__border--top font-purple`}>
          19:00&mdash;18:00
        </div>
        <div className={grid({s: 12, m: 12, l: 7, xl: 7})}>
          <span className={`block ${font({s: 'HNM4'})} ${spacing({s: 1}, {margin: ['bottom']})}`}>Workshop</span>
          <h3 className={`${font({s: 'WB7', m: 'WB6'})} ${spacing({s: 0}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`}>Creative Activities</h3>
          <span className={`${font({s: 'HNM4'})} block`}>Reading Room</span>
        </div>
        <div className={`${grid({s: 12, m: 12, l: 3, xl: 3})} ${spacing({s: 2}, {margin: ['top']})} ${spacing({l: 0}, {margin: ['top']})}`}>
          <div className='event-schedule__meta flex flex--h-space-between flex--v-start'>
            <div className="event-schedule__tickets">
              <div className={`${spacing({s: 1}, {margin: ['right', 'bottom']})} ${font({s: 'HNM4'})}`}>No ticket required</div>
              <div className={`${spacing({s: 1}, {margin: ['right', 'bottom']})} ${font({s: 'HNM4'})}`}>Drop-in</div>
              <div>
                <Icon name='hearingLoop' />
              </div>
            </div>
            <span className='event-schedule__toggle'>
              <Icon name='plus' />
            </span>
          </div>
        </div>
      </div>
    </button>
    <div className='grid js-show-hide-drawer'>
      <div className={`${grid({s: 12, m: 12, l: 2, xl: 2})} ${spacing({s: 2}, {margin: ['bottom']})} ${spacing({l: 0}, {margin: ['bottom']})} event-schedule__border event-schedule__border--bottom`}></div>
      <div className={grid({s: 12, m: 12, l: 7, xl: 7})}>
        <div className='drawer__body'>
          <p className={`${spacing({s: 3}, {margin: ['top']})} ${spacing({s: 1}, {margin: ['bottom']})}`}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam illum aspernatur repudiandae quidem incidunt, culpa exercitationem tempore aliquam, sed ipsa officiis consectetur repellat quis voluptatem obcaecati, consequuntur labore. Ea, quis.</p>

          <div className={spacing({s: 4}, {margin: ['bottom']})}>
            <MoreInfoLink url='#' name='More information' />
          </div>

          <Author name='Bill Murray' image='http://fillmurray.com/100/100' description='Culpa exercitationem tempore aliquam' />
          <Author name='Tim Bishop' image='http://fillmurray.com/200/200' />
        </div>
      </div>
      <div className={`${grid({s: 12, m: 12, l: 3, xl: 3})} ${spacing({s: 2}, {margin: ['top']})} drawer__body`}>
        <ButtonButton
          text='Book free tickets'
          icon='ticketAvailable'
          extraClasses={`${font({s: 'HNM5'})} btn--full-width-s ${spacing({s: 2}, {margin: ['bottom']})}`}
        />
        <img className="rounded-corners" src="http://fillmurray.com/600/400" />
      </div>
    </div>
  </li>
);

export default EventScheduleItem;
