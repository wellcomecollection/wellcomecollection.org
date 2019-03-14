// @flow
import type { UiEvent } from '../../../model/events';
import Button from '../Buttons/Button/Button';
import { Fragment } from 'react';
import { spacing, font } from '../../../utils/classnames';

type Props = {
  event: UiEvent,
};

// FIXME: add back to button extraClasses={`js-eventbrite-show-widget-${event.eventbriteId || ''}`}
// FIXME: iframe is set to display none, don't when we fix EB
const EventbriteButton = ({ event }: Props) => {
  return (
    <div className={spacing({ s: 4 }, { margin: ['bottom'] })}>
      {event.isCompletelySoldOut ? (
        <Button type="primary" disabled={true} text="Fully booked" />
      ) : (
        <Fragment>
          <Button
            type="primary"
            url={`https://www.eventbrite.com/e/${event.eventbriteId || ''}/`}
            trackingEvent={{
              category: 'component',
              action: 'booking-tickets:click',
              label: 'event-page',
            }}
            icon="ticket"
            text="Check for tickets"
          />
          <p
            className={`font-charcoal ${font({ s: 'HNL5' })} ${spacing(
              { s: 1 },
              { margin: ['top'] }
            )} ${spacing({ s: 0 }, { margin: ['bottom'] })}`}
          >
            with Eventbrite
          </p>
        </Fragment>
      )}
    </div>
  );
};

export default EventbriteButton;
