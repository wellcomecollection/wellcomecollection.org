import path from 'path';
import {setupApp} from 'common';
import {router} from './routes';

const staticPath = path.join(__dirname, '../../dist');
const viewPaths = [path.join(__dirname, 'views')];

const app = setupApp({ router, viewPaths, staticPath });

export {app};

