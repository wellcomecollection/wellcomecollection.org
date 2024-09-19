import { S3Client } from '@aws-sdk/client-s3';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getTogglesObject, putTogglesObject } from './s3-utils';

const argv = yargs(hideBin(process.argv)).parseSync();

export async function setDefaultValueFor(client: S3Client): Promise<void> {
  const remoteToggles = await getTogglesObject(client);

  const toggles = remoteToggles.toggles.map(toggle => {
    const arg = argv[toggle.id];
    if (arg && (arg === 'true' || arg === 'false')) {
      const defaultValue = arg === 'true';
      return {
        ...toggle,
        defaultValue,
      };
    }
    return toggle;
  });

  const togglesAndTests = {
    toggles,
    tests: remoteToggles.tests,
  };

  const { $metadata: putObjectResponseMetadata } = await putTogglesObject(
    client,
    togglesAndTests
  );

  if (putObjectResponseMetadata.httpStatusCode === 200) {
    console.info('Put toggles in S3 successfully');
  } else {
    throw new Error(`Error putting toggles in S3 ${putObjectResponseMetadata}`);
  }
}
