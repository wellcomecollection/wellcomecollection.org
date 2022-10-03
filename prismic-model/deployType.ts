import yargs from 'yargs';
import fetch from 'node-fetch';
import { setEnvsFromSecrets } from '@weco/ts-aws/secrets-manager';
import { getCreds } from '@weco/ts-aws/sts';
import prompts from 'prompts';
import { error, success, warn } from './console';
import { CustomType } from './src/types/CustomType';
import { secrets } from './config';
import { removeUndefinedProps, printDelta } from './utils';
import { diffString } from 'json-diff';
import { getContentTypes } from './utils/prismic';

const { id, argsConfirm } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --id [customTypeId]')
  .options({
    id: { type: 'string', demandOption: true },
    argsConfirm: { type: 'boolean', default: false },
  })
  .parseSync();

async function run() {
  const credentials = await getCreds('experience', 'developer');
  await setEnvsFromSecrets(secrets, credentials);

  const resp = await fetch(`https://customtypes.prismic.io/customtypes/${id}`, {
    headers: {
      Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
      repository: 'wellcomecollection',
    },
  });

  if (resp.status === 404) {
    error(
      `Prismic does not know about a custom type '${id}'. Do you have the right name?`
    );
    process.exit(1);
  }

  const remoteType: CustomType = await resp.json();

  const localType = (await import(`./src/${id}`)).default;

  const delta = diffString(remoteType, removeUndefinedProps(localType)); // we'll never get undefined props from Prismic, so we don't want them locally

  if (delta.length === 0) {
    success(`Remote type matches local model; nothing to do.`);
    process.exit(0);
  }

  printDelta(localType.id, delta);

  const { confirm } = argsConfirm
    ? { confirm: true }
    : await prompts({
        type: 'confirm',
        name: 'confirm',
        message: 'Happy with the diff?',
        initial: true,
      });

  if (!confirm) throw Error('Unhappy with the diff');

  const response = await fetch(
    `https://customtypes.prismic.io/customtypes/update`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
        repository: 'wellcomecollection',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localType),
    }
  );

  if (response.status === 204) {
    success(`Updated ${id} successfully`);

    const contentTypes = await getContentTypes(credentials);

    const remainingDeltas = contentTypes
      .filter(({ local }) => typeof local !== 'undefined')
      .filter(({ local, remote }) => {
        const delta = diffString(
          remote,
          removeUndefinedProps(local), // we'll never get undefined props from Prismic, so we don't want them locally
          {
            keepUnchangedValues: true,
          }
        );

        return delta.length > 0;
      });

    if (remainingDeltas.length > 0) {
      warn(
        `Other types have diff between local and remote, may also need deploying: ${remainingDeltas.join(
          ', '
        )}`
      );
    }
  } else {
    console.error(response);
    error(`Failed updating ${id}`);
  }
}

run();

export {};
