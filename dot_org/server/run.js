import config from './config';
import app from './app';

app.listen(config.server.port);
console.info(`Server up and running on http://localhost:${config.server.port} in ${app.env}`);
