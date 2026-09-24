import { S3Client } from '@aws-sdk/client-s3';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getTogglesObject, putTogglesObject } from './s3-utils';

const argv = yargs(hideBin(process.argv)).parseSync();

export async function setDefaultValueFor(client: S3Client): Promise<void> {
  const remoteToggles = await getTogglesObject(client);

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

  // Phased modes take an option id, or "null" to make nothing public again.
  // Basic modes (e.g. kioskMode) have no public default.
  const modes = (remoteToggles.modes ?? []).map(mode => {
    const arg = argv[mode.id];
    if (arg === undefined) return mode;
    if (!mode.phased) {
      console.info(`${mode.id} isn't a phased mode, so has no default to set.`);
      return mode;
    }
    const defaultValue = arg === 'null' ? null : String(arg);
    if (defaultValue && !mode.options.some(({ id }) => id === defaultValue)) {
      console.info(`${mode.id} has no phase "${defaultValue}", ignoring.`);
      return mode;
    }
    return {
      ...mode,
      defaultValue,
      // Cleared on deactivation, as for feature flags.
      dateActivated:
        mode.type === 'experimental' && defaultValue
          ? new Date().toISOString()
          : undefined,
    };
  });

  const toggles = {
    featureFlags,
    tests: remoteToggles.tests ?? [],
    modes,
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
