import fetch from 'node-fetch';
import { getCreds } from '@weco/ts-aws';
import prompts from 'prompts';
import { error, success, warn } from './console';
import { removeUndefinedProps, printDelta } from './utils';
import { diffString } from 'json-diff';
import { getContentTypes, getCustomType, getLocalType } from './utils/prismic';

async function promptDiff({ id, localType, delta }) {
  printDelta(localType.id, delta);
  const { confirm } = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: 'Happy with the diff?',
    initial: true,
  });

  if (!confirm) {
    warn('Unhappy with the diff');
    return false;
  }

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
    return true;
  } else {
    console.error(response);
    error(`Failed updating ${id}`);
    return true;
  }
}

async function run() {
  const credentials = await getCreds('experience', 'developer');
  const contentTypes = await getContentTypes(credentials);
  const noDiff = [];
  const hasDiff = [];

  await Promise.all(
    contentTypes.map(async ({ id }) => {
      const remoteType = await getCustomType(credentials, id);

      if (typeof remoteType === 'undefined') {
        error(
          `Prismic does not know about a custom type '${id}'. Something has gone wrong.`
        );
        return;
      }

      const localType = await getLocalType(id);
      if (typeof remoteType === 'undefined') {
        error(`Cannot load local type '${id}'. Something has gone wrong.`);
        return;
      }

      const delta = diffString(remoteType, removeUndefinedProps(localType)); // we'll never get undefined props from Prismic, so we don't want them locally

      if (delta.length === 0) {
        noDiff.push(id);
      } else {
        hasDiff.push({ id, localType, delta });
      }
    })
  );

  if (noDiff.length > 0) {
    success(
      `Remote type${noDiff.length === 1 ? '' : 's'} "${noDiff.join(
        ', '
      )}" match${noDiff.length === 1 ? 'es' : ''} local model${
        noDiff.length === 1 ? '' : 's'
      }; nothing to do.`
    );
  }

  if (hasDiff.length > 0) {
    const nonUpdatedTypes = [];
    const updatedTypes = [];

    warn(
      `You'll be asked to confirm changes to: ${hasDiff
        .map(t => t.id)
        .join(', ')}.`
    );

    for (let i = 0; i < hasDiff.length; i++) {
      const type = hasDiff[i];
      const updated = await promptDiff({
        id: type.id,
        localType: type.localType,
        delta: type.delta,
      });

      if (!updated) {
        nonUpdatedTypes.push(type.id);
      } else {
        updatedTypes.push(type.id);
      }
    }

    if (nonUpdatedTypes.length > 0)
      warn(`You chose not to update ${nonUpdatedTypes.join(', ')}.`);
    if (updatedTypes.length > 0)
      warn(
        `You've updated some types (${updatedTypes.join(
          ', '
        )}). To ensure Prismic uses this new model, go make a small change to a page and publish it. e.g. https://wellcomecollection.prismic.io/documents~k=pages&w=test&b=working&c=unclassified&l=en-gb/YB3RoRIAACQATXTn/`
      );
  }
}

run();

export {};
