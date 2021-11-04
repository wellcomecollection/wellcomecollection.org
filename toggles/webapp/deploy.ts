import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import localToggles, { Toggle } from './toggles';
import { TogglesResp } from '.';
import { bucket, key } from './config';
import { putTogglesObject } from './aws';

export const withDefaultValuesUnmodified = (
  from: Toggle[],
  to: Toggle[]
): Toggle[] => {
  /**
   * We don't deploy over the defaultValue as this can be set manually by
   * updating the toggle via setDefaultValueFor.
   *
   * If we have turned a toggle off manually - we expect it to remain
   * off even after a deploy.
   *
   */
  const toggles = to.map(toggle => {
    const { defaultValue } = from.find(({ id }) => id === toggle.id) ?? {
      defaultValue: toggle.defaultValue,
    };
    return { ...toggle, defaultValue };
  });

  return toggles;
};

// see: https://github.com/aws/aws-sdk-js-v3/issues/1877
async function streamToString(stream: Readable): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
  });
}

export async function deploy(client: S3Client) {
  const getObjectCommand = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  const { Body: body } = await client.send(getObjectCommand);

  const remoteToggles: TogglesResp = JSON.parse(
    await streamToString(body as Readable)
  );

  const togglesToDeploy = withDefaultValuesUnmodified(remoteToggles.toggles, [
    ...localToggles.toggles,
  ]);

  // We don't bother looking at the `.tests` during deployments as the `defaultValue`s
  // don't do anything as values are randomly assigned.
  // We should probably look at the structure of features vs tests.
  const togglesAndTests: TogglesResp = {
    toggles: togglesToDeploy,
    tests: localToggles.tests,
  };

  const { $metadata: putObjectResponseMetadata } = await putTogglesObject(
    client,
    togglesAndTests
  );

  if (putObjectResponseMetadata.httpStatusCode === 200) {
    console.info(`Success!`);
  } else {
    throw new Error(`Error putting toggles in S3 ${putObjectResponseMetadata}`);
  }
}
