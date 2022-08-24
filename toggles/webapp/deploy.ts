import { S3Client } from '@aws-sdk/client-s3';
import { TogglesResp } from '.';
import { getTogglesObject, putTogglesObject } from './s3-utils';
import localToggles, { Toggle } from './toggles';

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

    if (defaultValue !== toggle.defaultValue) {
      console.log(
        `Ignoring new default value of ${toggle.id}; use setDefaultValueFor (old: ${defaultValue}, new: ${toggle.defaultValue})`
      );
    }

    return { ...toggle, defaultValue };
  });

  return toggles;
};

export async function deploy(client: S3Client): Promise<void> {
  const remoteToggles = await getTogglesObject(client);

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
