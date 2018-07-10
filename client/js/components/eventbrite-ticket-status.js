/* global fetch */
import fastdom from 'fastdom';

export function eventbriteTicketStatus(el) {
  fastdom.measure(() => {
    const eventbriteId = el.getAttribute('data-eventbrite-ticket-id');

    fetch(`/eventbrite/button/events/${eventbriteId}/ticket_status`).then(resp => resp.json()).then(ticketButton => {
      fastdom.mutate(() => {
        el.innerHTML = ticketButton.html;
      });
    }).catch(_ => {
      // Fallback to non-enhanced version
      // button will read 'Book free tickets'
    });
  });
}
