import Router from 'koa-router';
import {getEventbriteEventTickets} from './controllers';

const r = new Router({ sensitive: true });
r.get('/eventbrite/event/:id/ticket_classes', getEventbriteEventTickets);

export const router = r.middleware();
