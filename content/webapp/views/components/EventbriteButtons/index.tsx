import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { ticket } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { Event } from '@weco/content/types/events';

const Location = styled(Space).attrs({
  as: 'p',
  className: font('intsb', -1),
  $v: { size: 's', properties: ['margin-bottom'] },
})``;

const Copy = styled.p.attrs({
  className: font('intr', -1),
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
    <div data-component="eventbrite-buttons">
      {event.isCompletelySoldOut ? (
        <Button variant="ButtonSolid" disabled={true} text="Fully booked" />
      ) : (
        <>
          {event.eventbriteId && (
            <>
              {isHybridEvent && (
                <Location>{event.locations[0]?.title}</Location>
              )}
              <Space
                $v={{
                  size: isHybridEvent ? 'm' : 's',
                  properties: ['margin-bottom'],
                }}
              >
                {event.inVenueSoldOut ? (
                  <Button
                    variant="ButtonSolid"
                    disabled={true}
                    text="Fully booked"
                  />
                ) : (
                  <Button
                    variant="ButtonSolidLink"
                    link={`https://www.eventbrite.com/e/${event.eventbriteId}`}
                    icon={ticket}
                    dataGtmProps={{
                      trigger: 'click_to_book',
                    }}
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
              <Space $v={{ size: 's', properties: ['margin-bottom'] }}>
                {event.onlineSoldOut ? (
                  <Button
                    variant="ButtonSolid"
                    disabled={true}
                    text="Fully booked"
                  />
                ) : (
                  <Button
                    variant="ButtonSolidLink"
                    link={`https://www.eventbrite.com/e/${event.onlineEventbriteId}`}
                    icon={ticket}
                    dataGtmProps={{
                      trigger: 'click_to_book',
                    }}
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
