import {eventbritePersonalOauthToken} from './config';
import superagent from 'superagent';
const eventbriteApiRoot = 'https://www.eventbriteapi.com/v3';

export async function getEventsInfo(ctx, next) {
  // expects ids to come in as id:boolean,id:boolean,id:boolean
  const ids = ctx.query.ids || '';
  const eventIds = ids.split(',');

  const eventsRequestPromises = eventIds.map(async (id) => {
    const eventResponse = await superagent.get(`${eventbriteApiRoot}/events/${id}/?token=${eventbritePersonalOauthToken}`);
    const event = eventResponse.body;

    if (event.is_series === false) {
      const eventTickets = await superagent.get(`${eventbriteApiRoot}/events/${id}/ticket_classes/?token=${eventbritePersonalOauthToken}`);

      const tickets = eventTickets.body.ticket_classes.filter(ticketClass => {
        const ticketClassName = ticketClass.name.toLowerCase();
        const ignore = ticketClassName.startsWith('waiting list') ||
          ticketClassName.startsWith('comp');
        return !ignore;
      }).map(ticketClass => {
        const isFullyBooked = ticketClass.on_sale_status === 'SOLD_OUT';
        const bookingOpens = new Date(ticketClass.sales_start);
        const salesEnded = new Date(ticketClass.sales_end) < new Date();

        return {
          isFullyBooked,
          bookingOpens,
          salesEnded
        };
      });
      return tickets[0];
    } else {
      const eventsInSeriesResponse = await superagent.get(`${eventbriteApiRoot}/series/${id}/events/?token=${eventbritePersonalOauthToken}`);
      const eventsInSeries = eventsInSeriesResponse.body.events;
      const eventsInSeriesTickets = eventsInSeries.map(event => event.id).map(async (id) => {
        const eventTickets = await superagent.get(`${eventbriteApiRoot}/events/${id}/ticket_classes/?token=${eventbritePersonalOauthToken}`);
        const tickets = eventTickets.body.ticket_classes.filter(ticketClass => {
          const ticketClassName = ticketClass.name.toLowerCase();
          const ignore = ticketClassName.startsWith('waiting list') ||
            ticketClassName.startsWith('comp');
          return !ignore;
        }).map(ticketClass => {
          const isFullyBooked = ticketClass.on_sale_status === 'SOLD_OUT';
          const bookingOpens = new Date(ticketClass.sales_start);
          const salesEnded = new Date(ticketClass.sales_end) < new Date();

          return {
            isFullyBooked,
            bookingOpens,
            salesEnded
          };
        });
        return tickets[0];
      });

      const eventsTickets = await Promise.all(eventsInSeriesTickets);
      return eventsTickets;
    }
  }).filter(Boolean);

  const responses = await Promise.all(eventsRequestPromises);

  ctx.body = {results: responses.filter(Boolean)};
}

export async function renderEventbriteWidget(ctx, next) {
  const id = ctx.params.id;
  const iframeContent = await superagent.get(`https://eventbrite.com/tickets-external?eid=${id}&ref=etckt`);
  const html = iframeContent.text.concat(`<style>.js-powered-by-eb-link {display: none;}</style>`);
  ctx.body = html;
}
