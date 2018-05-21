// @flow

import type {Event} from '../../../model/events';
import {Fragment} from 'react';
import Button from '../Buttons/Button/Button';
import {spacing, font} from '../../../utils/classnames';

type Props = {|
  event: Event, // TODO
|}

function getButtonMarkup(event) {
  if (!event.eventbriteId) return;

  if (event.isCompletelySoldOut) {
    return (
      <Button
        type='primary'
        text='Fully booked'
        icon='ticketAvailable' />
    );
  } else {
    return (
      <div className='js-eventbrite-ticket-button' data-eventbrite-ticket-id={event.eventbriteId}>
        <Button
          type='primary'
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
        <Button
          type='primary'
          disabled={true}
          text='Fully booked' />
      </Fragment>
    );
  } else {
    return (
      <Button
        type='primary'
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
