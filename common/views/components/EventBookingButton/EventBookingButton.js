// @flow

import type {Event} from '../../../model/events';
import {Fragment} from 'react';
import ButtonButton from '../Buttons/ButtonButton/ButtonButton';
import LinkButton from '../Buttons/LinkButton/LinkButton';
import {spacing, font} from '../../../utils/classnames';

type Props = {|
  event: Event, // TODO
|}

function getButtonMarkup(event) {
  if (!event.eventbriteId) return;

  if (event.isCompletelySoldOut) {
    return (
      <ButtonButton
        extraClasses='btn--primary'
        text='Fully booked'
        icon='ticketAvailable' />
    );
  } else {
    return (
      <div className='js-eventbrite-ticket-button' data-eventbrite-ticket-id={event.eventbriteId}>
        <LinkButton
          extraClasses='btn--primary'
          href={`https://www.eventbrite.com/e/${event.eventbriteId || ''}/`}
          icon='ticketAvailable'
          text='Book free tickets' />
      </div>
    );
  }
}

function getBookingEnquiryMarkup(event) {
  if (!event.bookingEnquiryTeam) return;

  if (event.isCompletelySoldOut) {
    return (
      <Fragment>
        <ButtonButton
          extraClasses='btn--primary'
          disabled={true}
          text='Fully booked' />
      </Fragment>
    );
  } else {
    return (
      <LinkButton
        extraClasses='btn--primary'
        href={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
        icon='email'
        text='Email to book' />
    );
  }
}

const EventBookingButton = ({ event }: Props) => (
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
