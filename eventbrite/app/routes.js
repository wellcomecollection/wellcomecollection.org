import Router from 'koa-router';
import {
  renderEventbriteButton,
  renderEventbriteTicketStatus
} from './controllers';

const r = new Router({ sensitive: true });
r.get('/eventbrite/button/events/:id/ticket_classes', renderEventbriteButton);
r.get('/eventbrite/button/events/:id/ticket_status', renderEventbriteTicketStatus);

export const router = r.middleware();
