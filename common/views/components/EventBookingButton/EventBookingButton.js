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
          url={`https://www.eventbrite.com/e/${event.eventbriteId || ''}/`}
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
        url={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
        icon='email'
        text='Email to book' />
    );
  }
}

const EventBookingButton = ({ event }: Props) => {
  const team = event.bookingEnquiryTeam; // Not sure why, but this solves flow null check problem below

  return (
    <Fragment>
      {getButtonMarkup(event)}
      {getBookingEnquiryMarkup(event)}
      {team &&
        <a className={`block font-charcoal ${font({s: 'HNL5'})} ${spacing({s: 1}, {margin: ['top']})}`}
          href={`mailto:${team.email}?subject=${event.title}`}>{team.email}</a>
      }
    </Fragment>
  );
};

export default EventBookingButton;
