// @flow
import path from 'path';
import {setupApp} from 'common';
import {router} from 'routes';

const staticPath = path.join(__dirname, '../../dist');
const viewPaths = [path.join(__dirname, 'views')];

setupApp({ router, viewPaths, staticPath }).listen(3001);

console.log('Exhibitions service started!');
