import { UiEvent } from '../../../model/events';
import { Fragment } from 'react';
import ButtonSolidLink from '../ButtonSolidLink/ButtonSolidLink';
import Message from '../Message/Message';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import styled from 'styled-components';
import { ticketAvailable, email } from '@weco/common/icons';

type Props = {
  event: UiEvent;
};

function getButtonMarkup(event: UiEvent) {
  if (!event.eventbriteId) return;

  if (event.isCompletelySoldOut) {
    return <Message text={`Fully booked`} />;
  } else {
    return (
      <div
        className="js-eventbrite-ticket-button"
        data-eventbrite-ticket-id={event.eventbriteId}
      >
        <ButtonSolidLink
          link={`https://www.eventbrite.com/e/${event.eventbriteId || ''}/`}
          icon={ticketAvailable}
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
      <ButtonSolidLink
        link={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
        icon={email}
        text="Email to book"
      />
    );
  }
}

type EventBookingButtonProps = {
  email: string;
  title: string;
};

const EventBookingButtonLink = styled(Space).attrs<EventBookingButtonProps>(
  props => ({
    v: {
      size: 's',
      properties: ['margin-top'],
    },
    className: `block font-charcoal ${font('hnr', 4)}`,
    href: `mailto:${props.email}?subject=${props.title}`,
  })
)<EventBookingButtonProps>``;

const EventBookingButton = ({ event }: Props) => {
  const team = event.bookingEnquiryTeam; // Not sure why, but this solves flow null check problem below

  return (
    <Fragment>
      {getButtonMarkup(event)}
      {getBookingEnquiryMarkup(event)}
      {team && (
        <EventBookingButtonLink email={team.email} title={event.title}>
          {team.email}
        </EventBookingButtonLink>
      )}
    </Fragment>
  );
};

export default EventBookingButton;
