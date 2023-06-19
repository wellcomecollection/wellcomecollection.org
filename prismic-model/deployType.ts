import yargs from 'yargs';
import fetch from 'node-fetch';
import { getCreds } from '@weco/ts-aws';
import prompts from 'prompts';
import { error, success, warn } from './console';
import { removeUndefinedProps, printDelta } from './utils';
import { diffString } from 'json-diff';
import {
  Credentials,
  getContentTypes,
  getCustomType,
  getLocalType,
} from './utils/prismic';

const { id, argsConfirm } = yargs(process.argv.slice(2))
  .usage('Usage: $0 --id [customTypeId]')
  .options({
    id: { type: 'string', demandOption: true },
    argsConfirm: { type: 'boolean', default: false },
  })
  .parseSync();

/** When we modify a slice, it may affect multiple types.
 *
 * After you deploy a type, this function will check the other types to see if there
 * are any outstanding diffs, and give you a warning like:
 *
 *      Other types have diff between local and remote, may also need deploying:
 *      exhibitions, events, pages, series, projects, event-series
 */
async function checkForOtherDiffs(credentials: Credentials) {
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
    const idString = remainingDeltas.map(d => d.id).join(', ');
    warn(
      `Other types have diff between local and remote, may also need deploying: ${idString}`
    );
  }
}

async function run() {
  const credentials = await getCreds('experience', 'developer');

  const remoteType = await getCustomType(credentials, id);

  if (typeof remoteType === 'undefined') {
    error(
      `Prismic does not know about a custom type '${id}'. Do you have the right name?`
    );
    process.exit(1);
  }

  const localType = await getLocalType(id);

  if (typeof remoteType === 'undefined') {
    error(`Cannot load local type '${id}'. Do you have the right name?`);
    process.exit(1);
  }

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
    success(
      `Updated ${id} successfully.
      To ensure Prismic uses this new model, go make a small change to a page and publish it. e.g. https://wellcomecollection.prismic.io/documents~k=pages&w=test&b=working&c=unclassified&l=en-gb/YB3RoRIAACQATXTn/`
    );

    await checkForOtherDiffs(credentials);
  } else {
    console.error(response);
    error(`Failed updating ${id}`);
  }
}

run();

export {};
