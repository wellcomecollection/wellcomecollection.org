// @flow
import type { UiEvent } from '../../../model/events';
// $FlowFixMe (tsx)
import ButtonSolid from '../ButtonSolid/ButtonSolid';
// $FlowFixMe (tsx)
import ButtonSolidLink from '../ButtonSolidLink/ButtonSolidLink';
import { Fragment } from 'react';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';

type Props = {
  event: UiEvent,
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
              icon="ticket"
              text="Check for tickets"
            />
          </Space>
          <p
            className={classNames({
              'font-charcoal no-margin': true,
              [font('hnl', 4)]: true,
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
