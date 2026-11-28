import { redactAccessTokensFromPayload } from '@weco/common/utils/redact-access-tokens';

import apmConfig from './apmConfig';

function initApm(serviceName: string): void {
  const config = apmConfig.server(serviceName);
  if (process.env.NODE_ENV !== 'test' && config.serverUrl) {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const agent = require('elastic-apm-node').start(config);
    // APM sends an error's own fields, e.g. a Prismic error's `url`
    agent.addErrorFilter(redactAccessTokensFromPayload);
  }
}

// This needs to be the first module loaded in the application
module.exports = initApm;
