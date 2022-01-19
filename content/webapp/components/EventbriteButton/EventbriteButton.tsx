import { UiEvent } from '@weco/common/model/events';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import { Fragment } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { ticket } from '@weco/common/icons';

type Props = {
  event: UiEvent;
};

// FIXME: add back to button extraClasses={`js-eventbrite-show-widget-${event.eventbriteId || ''}`}
// FIXME: iframe is set to display none, don't when we fix EB
const EventbriteButton = ({ event }: Props) => {
  return (
    <div>
      {event.isCompletelySoldOut ? (
        <ButtonSolid disabled={true} text="Fully booked" />
      ) : (
        <Fragment>
          <Space v={{ size: 's', properties: ['margin-bottom'] }}>
            <ButtonSolidLink
              link={`https://www.eventbrite.com/e/${event.eventbriteId || ''}/`}
              trackingEvent={{
                category: 'component',
                action: 'booking-tickets:click',
                label: 'event-page',
              }}
              icon={ticket}
              text="Check for tickets"
            />
          </Space>
          <p
            className={classNames({
              'font-charcoal no-margin': true,
              [font('hnr', 5)]: true,
            })}
          >
            Tickets via Eventbrite
          </p>
        </Fragment>
      )}
    </div>
  );
};

export default EventbriteButton;
