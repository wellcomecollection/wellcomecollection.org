// @flow
import {spacing, font} from '../../../utils/classnames';
import {Fragment, Component} from 'react';
import {formatDate} from '../../../utils/format-date';
import OpeningHoursTable from '../../components/OpeningHoursTable/OpeningHoursTable';
import OpeningHoursTableGrouped from '../../components/OpeningHoursTableGrouped/OpeningHoursTableGrouped';

type Props = {|
  extraClasses?: string,
  groupedVenues: any,
  upcomingExceptionalOpeningPeriods: Array<Date[]>
|}

type State = {|
  activePlace: string
|}

class OpeningHours extends Component<Props, State> {
  state = {
    activePlace: this.props.groupedVenues && Object.keys(this.props.groupedVenues)[0]
  };

  updateActivePlace = (event: any) => {
    event.preventDefault();

    this.setState({
      activePlace: event.target.id
    });
  }

  render() {
    const {
      upcomingExceptionalOpeningPeriods,
      extraClasses,
      groupedVenues
    } = this.props;

    return (
      <Fragment>
        {!groupedVenues &&
          <p className={spacing({s: 2}, {margin: ['bottom']})}>
            <a className={font({s: 'HNL6', m: 'HNL5'})} href='https://wellcomecollection.org/info/opening-times'>
              Opening times
            </a>
          </p>
        }
        {upcomingExceptionalOpeningPeriods && upcomingExceptionalOpeningPeriods.length > 0 &&
          <p className={font({s: 'HNM4'})}>
            Our opening times will change
            {upcomingExceptionalOpeningPeriods.map((group, i, array) => {
              const firstDate = group[0];
              const lastDate = group[group.length - 1];

              if (firstDate && lastDate) {
                if (group.length > 1) {
                  return (
                    <span key={firstDate}>
                      {(array.length > 1 && i > 0) && ' and '}
                      {` between`} <span style={{'whiteSpace': 'nowrap'}}>{formatDate(firstDate)}</span>
                      &mdash;
                      <span style={{'whiteSpace': 'nowrap'}}>{formatDate(lastDate)}</span>
                    </span>
                  );
                } else {
                  return (
                    <Fragment key={firstDate}>
                      {` on`} <span style={{'whiteSpace': 'nowrap'}}>
                        {formatDate(firstDate)}
                      </span>
                    </Fragment>
                  );
                }
              }
            })}
            . Please check our <a href='/info/opening-times#exceptional'>modified opening times</a> for details before you travel.
          </p>
        }
        <div className={`opening-hours ${extraClasses || ''} js-opening-hours js-tabs`}>
          <ul className={`plain-list opening-hours__tablist ${font({s: 'HNM5'})} ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['top', 'left', 'bottom', 'right']})} js-tablist`}>
            {groupedVenues && Object.keys(groupedVenues).map((key) => (
              <li key={key} className={`opening-hours__tabitem js-tabitem ${key === this.state.activePlace ? 'opening-hours__tabitem--is-current' : ''}`}>
                <a id={key}
                  className='opening-hours__tablink js-tablink' href={`#${key}`}
                  aria-selected={key === this.state.activePlace}
                  onClick={this.updateActivePlace}>{groupedVenues[key].title}</a>
              </li>
            ))}
          </ul>
          {groupedVenues && Object.keys(groupedVenues).map((key) => (
            <div key={key} id={key} className={`js-tabpanel opening-hours__panel ${key === this.state.activePlace ? 'opening-hours__panel--is-visible' : ''} ${extraClasses || ''}`}>
              <div className='js-tabfocus'>
                <div className='is-hidden-m is-hidden-l is-hidden-xl'>
                  {groupedVenues[key].hours.map((place) => (
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
          ))}
        </div>
      </Fragment>
    );
  }
}

export default OpeningHours;
