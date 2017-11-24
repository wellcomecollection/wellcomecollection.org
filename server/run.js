import config from './config';
import {setupApp} from './app';
const app = setupApp().listen(config.server.port);
console.info(`Server up and running on http://localhost:${config.server.port} in ${app.env}`);
