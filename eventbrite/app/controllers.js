// @flow
import {eventbritePersonalOauthToken} from './config';
import superagent from 'superagent';
const eventbriteApiRoot = 'https://www.eventbriteapi.com/v3';

type OnSaleStatus = 'available' | 'unavailable';
type TicketType = 'access' | 'comp' | 'waitinglist' | 'standard';
type Ticket = {
  onSaleStatus: OnSaleStatus;
  ticketType: TicketType;
};

export async function getEventbriteEventTickets(ctx, next) {
  const eventTickets = await superagent.get(`${eventbriteApiRoot}/events/${ctx.params.id}/ticket_classes/?token=${eventbritePersonalOauthToken}`);

  const tickets = eventTickets.body.ticket_classes.map(ticketClass => {
    const onSaleStatus = ticketClass.on_sale_status === 'AVAILABLE' ? 'available' : 'unavailable';
    const ticketClassName = ticketClass.name.toLowerCase();
    const ticketType: TicketType =
      ticketClassName.startsWith('waiting list') ? 'waitinglist' :
      ticketClassName.startsWith('comp ') ? 'comp' : 'standard';

    return {onSaleStatus, ticketType};
  }).filter(ticket => ticket.ticketType === 'standard'); // we only want to show standard tickets for now...

  ctx.body = {tickets};
}
