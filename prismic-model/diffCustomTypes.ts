import { diffString } from 'json-diff';

import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getCreds } from '@weco/ts-aws';

import { isCi } from './config';
import { error, success } from './console';
import { printDelta, removeUndefinedProps } from './utils';
import { Credentials, getContentTypes, getSharedSlices } from './utils/prismic';

export default async function diffContentTypes(
  credentials?: Credentials
): Promise<void> {
  const contentTypes = await getContentTypes(credentials);
  const sharedSlices = await getSharedSlices(credentials);

  const typesDeltas = contentTypes
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

  const sliceDeltas = sharedSlices
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

  if (typesDeltas.length > 0 || sliceDeltas.length > 0) {
    typesDeltas.length > 0 &&
      error(`Diffs found on ${typesDeltas.map(delta => delta.id).join(', ')}`);
    sliceDeltas.length > 0 &&
      error(`Diffs found on ${sliceDeltas.map(delta => delta.id).join(', ')}`);
    process.exit(1);
  }

  success('No diffs found on custom types or slices');
}

async function run() {
  const credentials = isCi
    ? undefined
    : await getCreds('experience', 'developer');

  await diffContentTypes(credentials);
}

run();
