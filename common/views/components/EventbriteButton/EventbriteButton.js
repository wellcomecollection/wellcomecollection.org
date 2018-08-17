// @flow
import type {UiEvent} from '../../../model/events';
import Button from '../Buttons/Button/Button';
import {Fragment} from 'react';
import {spacing, font} from '../../../utils/classnames';

type Props = {
  event: UiEvent
}

const ticketButtonText = 'Check for tickets';
const ticketButtonLoadingText = 'Loading…';

const EventbriteButton = ({event}: Props) => {
  return (
    <div>
      {event.isCompletelySoldOut ? <Button type='primary' disabled={true} text='Fully booked' />
        : (
          <Fragment>
            <Button
              type='primary'
              id={`eventbrite-show-widget-${event.eventbriteId || ''}`}
              url={`https://www.eventbrite.com/e/${event.eventbriteId}/`}
              trackingEvent={{
                category: 'component',
                action: 'booking-tickets:click',
                label: 'event-page'
              }}
              icon='ticket'
              text={ticketButtonText} />
            <iframe
              id={`eventbrite-widget-${event.eventbriteId || ''}`}
              src={`/eventbrite/widget/${event.eventbriteId || ''}`}
              frameBorder='0'
              width='100%'
              vspace='0'
              hspace='0'
              marginHeight='5'
              marginWidth='5'
              scrolling='auto'
              height='1'>
            </iframe>
            <script dangerouslySetInnerHTML={{ __html: `
              (function() {
                var iframe = document.getElementById('eventbrite-widget-${event.eventbriteId || ''}');
                var showWidget = document.getElementById('eventbrite-show-widget-${event.eventbriteId || ''}');
                showWidget.classList.add('disabled');
                showWidget.innerHTML = showWidget.innerHTML.replace('${ticketButtonText}', '${ticketButtonLoadingText}');

                iframe.addEventListener('load', function() {
                  iframe.height = iframe.contentWindow.document.body.scrollHeight;
                  iframe.style.display = 'none';
                  showWidget.classList.remove('disabled');

                  showWidget.addEventListener('click', function(event) {
                    event.preventDefault();
                    showWidget.style.display = 'none';
                    iframe.style.display = 'block';
                    return false;
                  });
                  showWidget.innerHTML = showWidget.innerHTML.replace('${ticketButtonLoadingText}', '${ticketButtonText}');
                  showWidget.disabled = null;
                });
              })();
            `}}>
            </script>
            <p className={`font-charcoal ${font({s: 'HNL5'})} ${spacing({s: 1}, {margin: ['top']})} ${spacing({s: 0}, {margin: ['bottom']})}`}>with Eventbrite</p>
          </Fragment>
        )
      }
    </div>
  );
};

export default EventbriteButton;
