import yargs from 'yargs';
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';
import * as jsondiffpatch from 'jsondiffpatch';
import prompts from 'prompts';
import { error, success } from './console';

dotenv.config();

type PrismicCustomType = {
  id: string;
  label: string;
  repeatable: boolean;
  json: unknown;
  status: boolean;
};

const { id, argsConfirm } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --id [customTypeId]')
  .options({
    id: { type: 'string', demandOption: true },
    argsConfirm: { type: 'boolean', default: false },
  })
  .parseSync();

async function run() {
  const remoteType: PrismicCustomType = await fetch(
    `https://customtypes.prismic.io/customtypes/${id}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PRISMIC_BEARER_TOKEN}`,
        repository: process.env.PRISMIC_REPOSITORY,
      },
    }
  ).then(resp => resp.json());

  const localType = (await import(`./src/${id}`)).default;

  const delta = jsondiffpatch.diff(remoteType, localType);
  const diff = jsondiffpatch.formatters.console.format(delta, remoteType);

  console.info('------------------------');
  console.info(diff);
  console.info('------------------------');

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
        repository: process.env.PRISMIC_REPOSITORY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(localType),
    }
  );

  if (response.status === 204) {
    success(`Updated ${id} successfully`);
  } else {
    error(`Failed updating ${id}`, response);
  }
}

run();

export {};
