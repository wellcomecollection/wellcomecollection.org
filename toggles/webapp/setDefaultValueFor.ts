import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { key } from './config';
import { getTogglesObject, putTogglesObject } from './s3-utils';
import { CreateInvalidationCommand } from '@aws-sdk/client-cloudfront';
import { S3Client } from '@aws-sdk/client-s3';

const argv = yargs(hideBin(process.argv)).parseSync();

export async function setDefaultValueFor(client: S3Client) {
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
    console.info(`Put toggles in S3 successfully`);
  } else {
    throw new Error(`Error putting toggles in S3 ${putObjectResponseMetadata}`);
  }

  // create an invalidation on the object
  const command = new CreateInvalidationCommand({
    DistributionId: 'E34PPJX23D6HKG',
    InvalidationBatch: {
      Paths: { Items: [`/${key}`], Quantity: 1 },
      CallerReference: `TogglesInvalidationCallerReference${Date.now()}`,
    },
  });
  const response = await client.send(command);
  console.info(response);
}
