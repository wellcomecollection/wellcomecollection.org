import { FC } from 'react';
import { Event } from '../../types/events';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { ticket } from '@weco/common/icons';

type Props = {
  event: Event;
};

const EventbriteButtons: FC<Props> = ({ event }) => {
  if (!event.eventbriteId && !event.onlineEventbriteId) return null;
  const isHybridEvent = event.eventbriteId && event.onlineEventbriteId;
  return (
    <div>
      {event.isCompletelySoldOut ? (
        <ButtonSolid disabled={true} text="Fully booked" />
      ) : (
        <>
          {event.eventbriteId && (
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <ButtonSolidLink
                link={`https://www.eventbrite.com/e/${
                  event.eventbriteId || ''
                }/`}
                trackingEvent={{
                  category: 'component',
                  action: 'booking-tickets:click',
                  label: 'event-page',
                }}
                icon={ticket}
                text={isHybridEvent ? 'In-venue tickets' : 'Check for tickets'}
              />
            </Space>
          )}
          {event.onlineEventbriteId && (
            <Space v={{ size: 's', properties: ['margin-bottom'] }}>
              <ButtonSolidLink
                link={`https://www.eventbrite.com/e/${
                  event.onlineEventbriteId || ''
                }/`}
                trackingEvent={{
                  category: 'component',
                  action: 'booking-tickets:click',
                  label: 'event-page',
                }}
                icon={ticket}
                text={isHybridEvent ? 'Online tickets' : 'Check for tickets'}
              />
            </Space>
          )}
          <p
            className={classNames({
              'font-charcoal no-margin': true,
              [font('hnr', 5)]: true,
            })}
          >
            Tickets via Eventbrite
          </p>
        </>
      )}
    </div>
  );
};

export default EventbriteButtons;
