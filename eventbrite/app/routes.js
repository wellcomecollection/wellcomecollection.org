import Router from 'koa-router';
import {renderEventbriteButton} from './controllers';

const r = new Router({ sensitive: true });
r.get('/eventbrite/button/events/:id/ticket_classes', renderEventbriteButton);

export const router = r.middleware();
