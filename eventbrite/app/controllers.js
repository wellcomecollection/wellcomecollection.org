import {eventbritePersonalOauthToken} from './config';
import superagent from 'superagent';
import {formatTimeDate} from 'common/filters/format-date';

const eventbriteApiRoot = 'https://www.eventbriteapi.com/v3';

type OnSaleStatus = 'available' | 'unavailable' | 'sold_out' | 'not_yet_on_sale';
type TicketType = 'access' | 'comp' | 'waitinglist' | 'standard';
type Ticket = {|
  eventbriteId: string,
  onSaleStatus: OnSaleStatus,
  ticketType: TicketType,
  saleStarts: string, // This isn't a date, as we want it in the display format
  cost: ?number // in pence
|};

async function getEventbriteEventTickets(id: string) {
  const eventTickets = await superagent.get(`${eventbriteApiRoot}/events/${id}/ticket_classes/?token=${eventbritePersonalOauthToken}`);

  const tickets = eventTickets.body.ticket_classes.map(ticketClass => {
    const onSaleStatus =
      ticketClass.on_sale_status === 'AVAILABLE' ? 'available'
        : ticketClass.on_sale_status === 'SOLD_OUT' ? 'sold_out'
          : ticketClass.on_sale_status === 'NOT_YET_ON_SALE' ? 'not_yet_on_sale' : 'unavailable';
    const ticketClassName = ticketClass.name.toLowerCase();
    const ticketType: TicketType =
      ticketClassName.startsWith('waiting list') ? 'waitinglist'
        : ticketClassName.startsWith('comp ') ? 'comp' : 'standard';
    const saleStarts = formatTimeDate(new Date(ticketClass.sales_start));
    const cost = ticketClass.cost && ticketClass.cost.value;
    return ({onSaleStatus, ticketType, saleStarts, eventbriteId: ticketClass.event_id, cost}: Ticket);
  }).filter(ticket => ticket.ticketType === 'standard'); // we only want to show standard tickets for now...

  return tickets;
}

export async function renderEventbriteTicketStatus(ctx, next) {
  const id = ctx.params.id;
  const tickets = await getEventbriteEventTickets(id);

  const standardTicket = tickets.find(ticket => ticket.ticketType === 'standard');
  if (standardTicket) {
    ctx.render('components/eventbrite-button/eventbrite-ticket-status', {
      ticket: standardTicket
    });

    ctx.body = {
      html: ctx.body,
      onSaleStatus: standardTicket.onSaleStatus
    };
  }
  return next();
}

export async function renderEventbriteButton(ctx, next) {
  const id = ctx.params.id;
  const tickets = await getEventbriteEventTickets(id);

  const standardTicket = tickets.find(ticket => ticket.ticketType === 'standard');
  if (standardTicket) {
    ctx.render('components/eventbrite-button/eventbrite-button', {
      ticket: standardTicket
    });

    ctx.body = {
      html: ctx.body,
      onSaleStatus: standardTicket.onSaleStatus
    };

    return next();
  }
}

export async function renderEventbriteWidget(ctx, next) {
  const id = ctx.params.id;
  const iframeContent = await superagent.get(`https://eventbrite.com/tickets-external?eid=${id}&ref=etckt`);
  const html = iframeContent.text;
  ctx.body = html;
}
