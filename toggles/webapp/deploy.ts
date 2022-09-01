import { S3Client } from '@aws-sdk/client-s3';
import { info } from 'console';
import { TogglesResp } from '.';
import { getTogglesObject, putTogglesObject } from './s3-utils';
import localToggles, { PublishedToggle, ToggleDefinition } from './toggles';

export const withDefaultValuesUnmodified = (
  publishedToggles: PublishedToggle[],
  definitions: ToggleDefinition[]
): PublishedToggle[] => {
  /**
   * We don't deploy over the defaultValue as this can be set manually by
   * updating the toggle via setDefaultValueFor.  We want to make updating
   * the default value of a toggle an explicit action.
   *
   * If we have turned a toggle off manually - we expect it to remain
   * off even after a deploy.
   *
   */
  return definitions.map(toggle => {
    const matchingToggle = publishedToggles.find(({ id }) => id === toggle.id);

    if (
      typeof matchingToggle !== 'undefined' &&
      matchingToggle.defaultValue !== toggle.initialValue
    ) {
      info(
        `${toggle.id}: the published value is ${matchingToggle.defaultValue} and will not be replaced`
      );
      info(`If you want to update the published value, run:`);
      info(`    yarn setDefaultValueFor --${toggle.id}=${toggle.initialValue}`);
      info('');
    }

    const defaultValue =
      typeof matchingToggle !== 'undefined'
        ? matchingToggle?.defaultValue
        : toggle.initialValue;

    return {
      id: toggle.id,
      description: toggle.description,
      title: toggle.title,
      defaultValue,
    };
  });
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
