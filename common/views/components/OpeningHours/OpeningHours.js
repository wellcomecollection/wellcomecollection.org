// @flow
import {spacing, font} from '../../../utils/classnames';
import {Fragment, Component} from 'react';
import {formatDay, formatDate} from '../../../utils/format-date';
import OpeningHoursTable from '../../components/OpeningHoursTable/OpeningHoursTable';
import OpeningHoursTableGrouped from '../../components/OpeningHoursTableGrouped/OpeningHoursTableGrouped';
import type {OverrideType, GroupedVenues} from '../../../model/opening-hours';
import type Moment from 'moment';

type Props = {|
  extraClasses?: string,
  groupedVenues: GroupedVenues,
  upcomingExceptionalOpeningPeriods: ?{dates: Moment[], type: OverrideType}[],
  idPrefix?: string
|}

type State = {|
  activePlace: string
|}

class OpeningHours extends Component<Props, State> {
  state = {
    activePlace: this.props && this.props.groupedVenues && `${this.props.idPrefix || ''}${Object.keys(this.props.groupedVenues)[0]}`
  };

  updateActivePlace = (event: any) => {
    event.preventDefault();

    this.setState({
      activePlace: event.target.getAttribute('data-panel-id')
    });
  }

  render() {
    const {
      upcomingExceptionalOpeningPeriods,
      extraClasses,
      groupedVenues,
      idPrefix
    } = this.props;

    return (
      <Fragment>
        {groupedVenues && !groupedVenues[Object.keys(groupedVenues)[0]].hours &&
          <p className={spacing({s: 2}, {margin: ['bottom']})}>
            <a className={font({s: 'HNL6', m: 'HNL5'})} href='https://wellcomecollection.org/opening-times'>
              Opening times
            </a>
          </p>
        }
        {upcomingExceptionalOpeningPeriods && upcomingExceptionalOpeningPeriods.length > 0 &&
          <p className={`plain-text ${font({s: 'HNM4'})}`}>
            Our opening times will change
            {upcomingExceptionalOpeningPeriods.map((group, i, array) => {
              const firstDate = group.dates[0];
              const lastDate = group.dates[group.dates.length - 1];
              let typeWording = '';
              if (group.type) {
                switch (group.type) {
                  case 'Bank holiday':
                    typeWording = ' for the bank holiday, ';
                    break;
                  case 'Christmas and New Year' || 'Easter':
                    typeWording = ` for ${group.type}, `;
                    break;
                  case 'Late Spectacular':
                    typeWording = ` for the ${formatDay(group.dates[0])} Late Spectacular, `;
                    break;
                  default:
                    typeWording = '';
                }
              }
              if (firstDate && lastDate) {
                if (group.dates.length > 1) {
                  return (
                    <span key={firstDate.toISOString()}>
                      {(array.length > 1 && i > 0) && ' and '}
                      {`${typeWording} between`} <span className='nowrap'>{formatDate(firstDate)}</span>
                      &mdash;
                      <span className='nowrap'>{formatDate(lastDate)}</span>
                    </span>
                  );
                } else {
                  return (
                    <Fragment key={firstDate.toISOString()}>
                      {`${typeWording} on`} <span className='nowrap'>
                        {formatDate(firstDate)}
                      </span>
                    </Fragment>
                  );
                }
              }
            })}
            . Please check our <a href='/opening-times#exceptional'>modified opening times</a> for details before you travel.
          </p>
        }
        {groupedVenues && groupedVenues[Object.keys(groupedVenues)[0]].hours &&
          <div className={`opening-hours ${extraClasses || ''} js-opening-hours js-tabs`}>
            <ul className={`plain-list opening-hours__tablist ${font({s: 'HNM5'})} ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['top', 'left', 'bottom', 'right']})} js-tablist`} role='tablist'>
              {groupedVenues && Object.keys(groupedVenues).map((key) => (
                <li key={key} className={`opening-hours__tabitem js-tabitem ${`${idPrefix || ''}${key}` === this.state.activePlace ? 'opening-hours__tabitem--is-current' : ''}`}>
                  <a data-panel-id={`${idPrefix || ''}${key}`}
                    className='opening-hours__tablink js-tablink' href={`#${idPrefix || ''}${key}`}
                    aria-selected={key === this.state.activePlace}
                    role='tab'
                    onClick={this.updateActivePlace}>{groupedVenues[key].title}</a>
                </li>
              ))}
            </ul>
            {groupedVenues && Object.keys(groupedVenues).map((key) => {
              const id = `${idPrefix || ''}${key}`;
              return (
                <div key={id} id={id} className={`js-tabpanel opening-hours__panel ${id === this.state.activePlace ? 'opening-hours__panel--is-visible' : ''} ${extraClasses || ''}`}>
                  <div className='js-tabfocus'>
                    <div className='is-hidden-m is-hidden-l is-hidden-xl'>
                      {groupedVenues[key].hours && groupedVenues[key].hours.map((place) => (
                        <OpeningHoursTable
                          key={place.id}
                          place={place} />
                      ))}
                    </div>
                    <div className='is-hidden-s'>
                      <OpeningHoursTableGrouped venues={groupedVenues[key].hours} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        }
      </Fragment>
    );
  }
}

export default OpeningHours;
