// @flow
import type { UiEvent } from '../../../model/events';
import Button from '../Buttons/Button/Button';
import { Fragment } from 'react';
import { font, classNames } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {
  event: UiEvent,
};

// FIXME: add back to button extraClasses={`js-eventbrite-show-widget-${event.eventbriteId || ''}`}
// FIXME: iframe is set to display none, don't when we fix EB
const EventbriteButton = ({ event }: Props) => {
  return (
    <div>
      {event.isCompletelySoldOut ? (
        <Button type="primary" disabled={true} text="Fully booked" />
      ) : (
        <Fragment>
          <VerticalSpace size="s">
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
          </VerticalSpace>
          <p
            className={classNames({
              'font-charcoal no-margin': true,
              [font({ s: 'HNL5' })]: true,
            })}
          >
            with Eventbrite
          </p>
        </Fragment>
      )}
    </div>
  );
};

export default EventbriteButton;
