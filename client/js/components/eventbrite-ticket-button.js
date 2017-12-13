/* global fetch */
import fastdom from 'fastdom';

export function eventbriteTicketButton(el) {
  fastdom.measure(() => {
    const eventbriteId = el.getAttribute('data-eventbrite-ticket-id');
    const buttonTextEl = el.querySelector('.js-eventbrite-ticket-button-text');

    fastdom.mutate(() => {
      buttonTextEl.innerHTML = 'Searching for tickets…';
    });

    fetch(`/eventbrite/button/events/${eventbriteId}/ticket_classes`).then(resp => resp.json()).then(ticketButton => {
      fastdom.mutate(() => {
        el.innerHTML = ticketButton.html;
      });
    });
  });
}
