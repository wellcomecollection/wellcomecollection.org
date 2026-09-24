import { S3Client } from '@aws-sdk/client-s3';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { dateActivatedFor } from './lifecycleDates';
import { getTogglesObject, putTogglesObject } from './s3-utils';

const argv = yargs(hideBin(process.argv)).parseSync();

export async function setDefaultValueFor(client: S3Client): Promise<void> {
  const remoteToggles = await getTogglesObject(client);

  // A/B tests are randomly assigned to users, so they have no default to set -
  // only feature flags and phased flags (below) have one that's settable here.
  const featureFlags = remoteToggles.featureFlags.map(toggle => {
    const arg = argv[toggle.id];
    if (arg && (arg === 'true' || arg === 'false')) {
      const defaultValue = arg === 'true';
      const isExperimental = toggle.type === 'experimental';
      return {
        ...toggle,
        defaultValue,
        // Cleared on deactivation so it only ever reflects a currently-active toggle's activation date.
        dateActivated: dateActivatedFor(isExperimental, defaultValue),
      };
    }
    return toggle;
  });

  // Phased flags work the same way, but the value is a phase id (or "null"
  // to make nothing public again) rather than true/false.
  const phasedFlags = (remoteToggles.phasedFlags ?? []).map(flag => {
    const arg = argv[flag.id];
    if (typeof arg !== 'string') return flag;

    const defaultPhase = arg === 'null' ? null : arg;
    const isValid =
      defaultPhase === null ||
      flag.phases.some(phase => phase.id === defaultPhase);
    if (!isValid) {
      console.info(
        `${flag.id}: "${arg}" isn't one of this flag's phases (${flag.phases
          .map(phase => phase.id)
          .join(', ')}) or "null" - ignoring.`
      );
      return flag;
    }

    const isExperimental = flag.type === 'experimental';
    return {
      ...flag,
      defaultPhase,
      dateActivated: dateActivatedFor(isExperimental, defaultPhase !== null),
    };
  });

  const toggles = {
    featureFlags,
    phasedFlags,
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
