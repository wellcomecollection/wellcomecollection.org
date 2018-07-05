/* global fetch */
import fastdom from 'fastdom';

export function eventbriteTicketButton(el) {
  fastdom.measure(() => {
    const eventbriteId = el.getAttribute('data-eventbrite-ticket-id');

    fetch(`/eventbrite/button/events/${eventbriteId}/ticket_classes`)
      .then(resp => resp.json())
      .then(ticketButton => {
        fastdom.mutate(() => {
          // This is a nasty hack to update the event info bar
          if (ticketButton.onSaleStatus === 'sold_out') {
            const el = document.getElementById('js-event-booking-info');
            if (el) {
              el.parentNode.removeChild(el);
            }
          }
          el.innerHTML = ticketButton.html;
        });
      }).catch(_ => {
        // Probably safest to do nothing if fetch fails
      });
  });
}
