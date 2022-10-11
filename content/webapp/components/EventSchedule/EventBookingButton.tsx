import { Event } from '../../types/events';
import { FC, Fragment } from 'react';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import Message from '@weco/common/views/components/Message/Message';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import styled from 'styled-components';
import { ticketAvailable, email } from '@weco/common/icons';

type Props = {
  event: Event;
};

function getButtonMarkup(event: Event) {
  if (!event.eventbriteId) return;

  if (event.isCompletelySoldOut) {
    return <Message text="Fully booked" />;
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

function getBookingEnquiryMarkup(event: Event) {
  if (!event.bookingEnquiryTeam) return;

  if (event.isCompletelySoldOut) {
    return <Message text="Fully booked" />;
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
    className: font('intr', 4),
    href: `mailto:${props.email}?subject=${props.title}`,
  })
)<EventBookingButtonProps>`
  display: block;
  color: ${props => props.theme.color('neutral.700')};
`;

const EventBookingButton: FC<Props> = ({ event }: Props) => {
  const team = event.bookingEnquiryTeam;

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
