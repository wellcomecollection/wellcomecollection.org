import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { email, ticketAvailable } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Message from '@weco/common/views/components/Message';
import Space from '@weco/common/views/components/styled/Space';
import { Event } from '@weco/content/types/events';

type Props = {
  event: Event;
};

const BookingButtonLink: FunctionComponent<Props> = ({ event }) => {
  if (!event.eventbriteId) return null;

  if (event.isCompletelySoldOut) {
    return <Message text="Fully booked" />;
  } else {
    return (
      <div data-eventbrite-ticket-id={event.eventbriteId}>
        <Button
          variant="ButtonSolidLink"
          link={`https://www.eventbrite.com/e/${event.eventbriteId}`}
          icon={ticketAvailable}
          text="Book free tickets"
        />
      </div>
    );
  }
};

const BookingEnquiryLink: FunctionComponent<Props> = ({ event }) => {
  if (!event.bookingEnquiryTeam) return null;

  if (event.isCompletelySoldOut) {
    return <Message text="Fully booked" />;
  } else {
    return (
      <Button
        variant="ButtonSolidLink"
        link={`mailto:${event.bookingEnquiryTeam.email}?subject=${event.title}`}
        icon={email}
        text="Email to book"
        dataGtmTrigger="click_to_book"
      />
    );
  }
};

type EventBookingButtonProps = {
  email: string;
  title: string;
};

const EventBookingButtonLink = styled(Space).attrs<EventBookingButtonProps>(
  props => ({
    className: font('intr', 4),
    href: `mailto:${props.email}?subject=${props.title}`,
    $v: { size: 's', properties: ['margin-top'] },
  })
)<EventBookingButtonProps>`
  display: block;
  color: ${props => props.theme.color('neutral.700')};
`;

const EventBookingButton: FunctionComponent<Props> = ({ event }) => {
  const team = event.bookingEnquiryTeam;

  return (
    <>
      <BookingButtonLink event={event} />
      <BookingEnquiryLink event={event} />
      {team && (
        <EventBookingButtonLink email={team.email} title={event.title}>
          {team.email}
        </EventBookingButtonLink>
      )}
    </>
  );
};

export default EventBookingButton;
