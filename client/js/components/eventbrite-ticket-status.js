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

export function eventbriteTicketStatusBeta(el) {
  const eventbriteId = el.getAttribute('data-eventbrite-id');
  // TODO: Remove no-cors and remove host from URL
  fetch(`http://localhost:9000/eventbrite/button/events/${eventbriteId}/ticket_status`, {mode: 'no-cors'})
    .then(res => res.json())
    .then(data => {
      if (data.onSaleStatus === 'not_yet_on_sale') {
        el.innerHTML = `Book from ${data.saleStarts}`;
        el.classList.remove('is-hidden');
      }
    });
}
