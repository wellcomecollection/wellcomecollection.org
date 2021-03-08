import { setupServer } from 'msw/node';
import { handlers } from './requestHandlers';

export const server = setupServer(...handlers);
