import { getCreds } from '@weco/ts-aws';
import { error, success } from './console';
import { isCi } from './config';
import { diffString } from 'json-diff';
import { removeUndefinedProps, printDelta } from './utils';
import { getContentTypes, Credentials } from './utils/prismic';
import { isNotUndefined } from '@weco/common/utils/type-guards';

export default async function diffContentTypes(
  credentials?: Credentials
): Promise<void> {
  const contentTypes = await getContentTypes(credentials);

  const deltas = contentTypes
    .filter(({ local }) => typeof local !== 'undefined')
    .map(({ id, local, remote }) => {
      const delta = diffString(
        remote,
        removeUndefinedProps(local), // we'll never get undefined props from Prismic, so we don't want them locally
        {
          keepUnchangedValues: true,
        }
      );

      if (delta.length > 0) {
        printDelta(id, delta);
        return { id };
      }
      return undefined;
    })
    .filter(isNotUndefined);

  if (deltas.length > 0) {
    error(`Diffs found on ${deltas.map(delta => delta.id).join(', ')}`);
    process.exit(1);
  }

  success('No diffs found on custom types');
}

async function run() {
  const credentials = isCi
    ? undefined
    : await getCreds('experience', 'developer');

  await diffContentTypes(credentials);
}

run();
