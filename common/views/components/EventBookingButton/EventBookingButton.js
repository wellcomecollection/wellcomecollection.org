// @flow

import type { UiEvent } from '../../../model/events';
import { Fragment } from 'react';
import Button from '../Buttons/Button/Button';
import Message from '../Message/Message';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';

type Props = {|
  event: UiEvent,
|};

function getButtonMarkup(event) {
  if (!event.eventbriteId) return;

  if (event.isCompletelySoldOut) {
    return <Message text={`Fully booked`} />;
  } else {
    return (
      <div
        className="js-eventbrite-ticket-button"
        data-eventbrite-ticket-id={event.eventbriteId}
      >
        <Button
          type="primary"
          url={`https://www.eventbrite.com/e/${event.eventbriteId || ''}/`}
          icon="ticketAvailable"
          text="Book free tickets"
        />
      </div>
    );
  }
}

function getBookingEnquiryMarkup(event) {
  if (!event.bookingEnquiryTeam) return;

  if (event.isCompletelySoldOut) {
    return <Message text={`Fully booked`} />;
  } else {
    return (
      <Button
        type="primary"
        url={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
        icon="email"
        text="Email to book"
      />
    );
  }
}

const EventBookingButton = ({ event }: Props) => {
  const team = event.bookingEnquiryTeam; // Not sure why, but this solves flow null check problem below

  return (
    <Fragment>
      {getButtonMarkup(event)}
      {getBookingEnquiryMarkup(event)}
      {team && (
        <Space
          v={{
            size: 's',
            properties: ['margin-top'],
          }}
          className={`block font-charcoal ${font('hnl', 4)}`}
          href={`mailto:${team.email}?subject=${event.title}`}
        >
          {team.email}
        </Space>
      )}
    </Fragment>
  );
};

export default EventBookingButton;
