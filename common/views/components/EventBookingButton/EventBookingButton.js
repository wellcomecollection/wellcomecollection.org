// @flow

import {spacing, font} from '../../../utils/classnames';
import {Fragment} from 'react';
import Icon from '../Icon/Icon';
import ButtonButton from '../Buttons/ButtonButton/ButtonButton';

type Props = {|
  event: Event, // TODO
|}

function getButtonMarkup(event) {
  if (!event.eventInfo.eventbriteId) return;

  if (event.eventInfo.isCompletelySoldOut) {
    return (
      <ButtonButton
        text='Fully booked'
        icon='ticketAvailable'
        extraClasses={`${font({s: 'HNM5'})} btn--full-width-s`}
      />
    );
  } else {
    return (
      <div className="js-eventbrite-ticket-button" data-eventbrite-ticket-id={event.eventInfo.eventbriteId}>
        <a className={`flex-inline flex--v-center flex--h-center btn btn--full-width-s ${font({s: 'HNM4'})}`}
          href={`https://www.eventbrite.com/e/${event.eventInfo.eventbriteId}/`}>
          <span><Icon name='ticketAvailable' /></span>
          <span className="js-eventbrite-ticket-button-text">Book free tickets</span>
        </a>
      </div>
    );
  }
}

function getBookingEnquiryMarkup(event) {
  if (!event.bookingEnquiryTeam) return;

  if (event.eventInfo.isCompletelySoldOut) {
    return (
      <Fragment>
        <button className={`${font({s: 'HNM4'})} ${spacing({s: 4}, {padding: ['left', 'right']})} flex-inline flex--h-center btn btn--full-width-s`}
          disabled="disabled" aria-disabled="true">
          Fully booked
        </button>
      </Fragment>
    );
  } else {
    return (
      <a className={`${font({s: 'HNM4'})} ${spacing({s: 4}, {padding: ['left', 'right']})} flex-inline flex--h-center btn btn--full-width-s`}
        href="mailto:{{ event.bookingEnquiryTeam.email }}?subject={{event.title}}">
        <span><Icon name='email' extraClasses='icon--white' /></span>
      Email to book
      </a>
    );
  }
}

const EventBookingButton = ({event}: Props) => (
  <Fragment>
    {getButtonMarkup(event)}
    {getBookingEnquiryMarkup(event)}
    {event.bookingEnquiryTeam &&
      <a className={`block font-charcoal ${font({s: 'HNL5'})} ${spacing({s: 1}, {margin: ['top']})}`}
        href={`mailto:{${event.bookingEnquiryTeam.email}?subject=${event.title}`}>{event.bookingEnquiryTeam.email}</a>
    }
  </Fragment>
);

export default EventBookingButton;
