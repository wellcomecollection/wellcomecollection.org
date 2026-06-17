import { S3Client } from '@aws-sdk/client-s3';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getTogglesObject, putTogglesObject } from './s3-utils';

const argv = yargs(hideBin(process.argv)).parseSync();

export async function setDefaultValueFor(client: S3Client): Promise<void> {
  const remoteToggles = await getTogglesObject(client);

  // Only feature flags have a defaultValue that can be overridden.
  // A/B tests are randomly assigned to users, so they have no default to set.
  const featureFlags = remoteToggles.featureFlags.map(toggle => {
    const arg = argv[toggle.id];
    if (arg && (arg === 'true' || arg === 'false')) {
      const defaultValue = arg === 'true';
      const isExperimental = toggle.type === 'experimental';
      return {
        ...toggle,
        defaultValue,
        // dateActivated tracks the most recent activation (experimental toggles only).
        // Cleared on deactivation so it only ever reflects a currently-active toggle's activation date.
        dateActivated:
          isExperimental && defaultValue ? new Date().toISOString() : undefined,
      };
    }
    return toggle;
  });

  const toggles = {
    featureFlags,
    tests: remoteToggles.tests ?? [],
    modes: remoteToggles.modes ?? [],
  };

  const { $metadata: putObjectResponseMetadata } = await putTogglesObject(
    client,
    toggles
  );

  if (putObjectResponseMetadata.httpStatusCode === 200) {
    console.info('Put toggles in S3 successfully');
  } else {
    throw new Error(`Error putting toggles in S3 ${putObjectResponseMetadata}`);
  }
}
