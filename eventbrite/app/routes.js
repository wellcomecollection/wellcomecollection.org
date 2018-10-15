import Router from 'koa-router';
import {
  renderEventbriteButton,
  renderEventbriteTicketStatus,
  renderEventbriteWidget,
  getEventsInfo
} from './controllers';

const r = new Router({ sensitive: true });
r.get('/eventbrite/button/events/:id/ticket_classes', renderEventbriteButton);
r.get('/eventbrite/button/events/:id/ticket_status', renderEventbriteTicketStatus);
r.get('/eventbrite/widget/:id', renderEventbriteWidget);
r.get('/eventbrite/api/v1/events', getEventsInfo);

export const router = r.middleware();
