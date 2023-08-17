import { FunctionComponent } from 'react';
import { Event } from '../../types/events';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { ticket } from '@weco/common/icons';
import styled from 'styled-components';

const Location = styled(Space).attrs({
  v: { size: 's', properties: ['margin-bottom'] },
  as: 'p',
  className: font('intb', 5),
})``;

const Copy = styled.p.attrs({
  className: font('intr', 5),
})`
  color: ${props => props.theme.color('neutral.700')};
  margin: 0;
`;

type Props = {
  event: Event;
};

const EventbriteButtons: FunctionComponent<Props> = ({ event }) => {
  if (!event.eventbriteId && !event.onlineEventbriteId) return null;
  const isHybridEvent = event.eventbriteId && event.onlineEventbriteId;
  return (
    <div>
      {event.isCompletelySoldOut ? (
        <ButtonSolid disabled={true} text="Fully booked" />
      ) : (
        <>
          {event.eventbriteId && (
            <>
              {isHybridEvent && (
                <Location>{event.locations[0]?.title}</Location>
              )}
              <Space
                v={{
                  size: isHybridEvent ? 'm' : 's',
                  properties: ['margin-bottom'],
                }}
              >
                {event.inVenueSoldOut ? (
                  <ButtonSolid disabled={true} text="Fully booked" />
                ) : (
                  <ButtonSolidLink
                    link={`https://www.eventbrite.com/e/${event.eventbriteId}`}
                    trackingEvent={{
                      category: 'component',
                      action: 'booking-tickets:click',
                      label: 'event-page',
                    }}
                    icon={ticket}
                    dataGtmTrigger="click_to_book"
                    text={
                      isHybridEvent ? 'In-venue tickets' : 'Check for tickets'
                    }
                  />
                )}
              </Space>
            </>
          )}
          {event.onlineEventbriteId && (
            <>
              {isHybridEvent && <Location>Livestream event</Location>}
              <Space v={{ size: 's', properties: ['margin-bottom'] }}>
                {event.onlineSoldOut ? (
                  <ButtonSolid disabled={true} text="Fully booked" />
                ) : (
                  <ButtonSolidLink
                    link={`https://www.eventbrite.com/e/${event.onlineEventbriteId}`}
                    trackingEvent={{
                      category: 'component',
                      action: 'booking-tickets:click',
                      label: 'event-page',
                    }}
                    icon={ticket}
                    dataGtmTrigger="click_to_book"
                    text={
                      isHybridEvent ? 'Online tickets' : 'Check for tickets'
                    }
                  />
                )}
              </Space>
            </>
          )}
          <Copy>Tickets via Eventbrite</Copy>
        </>
      )}
    </div>
  );
};

export default EventbriteButtons;
