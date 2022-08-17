import { createApp } from './app';
import { port } from '../config';

async function main() {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Running in dev environment, using secrets from AWS`);

    // We get a string like
    //
    //  {
    //    "ARN": "arn:aws:secretsmanager:eu-west-1:770700576653:secret:identity/stage/local_dev_client/credentials-o2vk5D",
    //    "SecretString": "{\"api_key\":…}",
    //  }
    //
    // from the Secrets Manager CLI.
    const credentials = JSON.parse(
      JSON.parse(process.env.CREDENTIALS)['SecretString']
    );

    process.env.AUTH0_CLIENT_ID = credentials['client_id'];
    process.env.AUTH0_DOMAIN = 'stage.account.wellcomecollection.org';
    process.env.IDENTITY_API_HOST =
      'https://v1-api.stage.account.wellcomecollection.org';
    process.env.SITE_BASE_URL = 'http://localhost:3000';
    process.env.AUTH0_CLIENT_SECRET = credentials['client_secret'];
    process.env.IDENTITY_API_KEY = credentials['api_key'];
    process.env.SESSION_KEYS = 'correct-horse-battery-staple'; // https://xkcd.com/936/
  }

  const app = await createApp();

  app.listen(port);

  if (process.env.NODE_ENV !== 'production') {
    console.log(`Server ready at: http://localhost:${port}/account`);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
