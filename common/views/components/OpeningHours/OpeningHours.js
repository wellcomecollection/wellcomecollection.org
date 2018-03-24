// @flow
import {spacing, font} from '../../../utils/classnames';
import {Fragment, Component} from 'react';
import {formatDate} from '../../../utils/format-date';
import OpeningHoursTable from '../../components/OpeningHoursTable/OpeningHoursTable';
import type {PlacesOpeningHours} from '../../../model/opening-hours';

type Props = {|
  id: string,
  extraClasses?: string,
  placesOpeningHours: PlacesOpeningHours,
  upcomingExceptionalOpeningPeriods: Array<Date[]>
|}

type State = {|
  activePlace: string
|}

class OpeningHours extends Component<Props, State> {
  state = {
    activePlace: this.props.placesOpeningHours[0].id
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
      placesOpeningHours,
      extraClasses,
      id
    } = this.props;

    return (
      <Fragment>
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
                      {(array.length > 1 && i > 0) && ', '}
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
            . Please check our <a href="/info/opening-times#exceptional">modified opening times</a> for details before you travel.
          </p>
        }
        <div className={`opening-hours ${extraClasses || ''} js-opening-hours js-tabs`}>
          <ul className={`plain-list opening-hours__tablist ${font({s: 'HNM6'})} ${spacing({s: 0}, {margin: ['top', 'left', 'bottom', 'right'], padding: ['top', 'left', 'bottom', 'right']})} js-tablist`}>
            {placesOpeningHours.map((place) => (
              <li key={place.id} className={`opening-hours__tabitem js-tabitem ${place.id === this.state.activePlace ? 'opening-hours__tabitem--is-current' : ''}`}>
                <a id={place.id}
                  aria-selected={place.id === this.state.activePlace}
                  className='opening-hours__tablink js-tablink' href={`#${id}-panel-${place.id}`}
                  onClick={this.updateActivePlace}>{place.name}</a>
              </li>
            ))}
          </ul>
          {placesOpeningHours.map((place) => (
            <OpeningHoursTable
              key={`${id}-panel-${place.id}`}
              id={id}
              place={place}
              isVisible={place.id === this.state.activePlace} />
          ))}
        </div>
      </Fragment>
    );
  }
}

export default OpeningHours;
