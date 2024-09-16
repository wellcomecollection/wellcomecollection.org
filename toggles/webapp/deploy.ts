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

    const { initialValue, ...otherFields } = toggle;

    return {
      ...otherFields,
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

  // GA4 now limits event parameter values to 100 characters: https://support.google.com/analytics/answer/9267744?hl=en
  // So instead of sending the whole toggles JSON blob we send a concatenated string of only the toggle names (preceeded with a ! if the toggle is false).
  const potentialToggleString = togglesAndTests.tests
    .map(toggle => `!${toggle.id}`) // replicating the condition of all toggles being false gives the longest possible string.
    .join(',');

  // We throw an error here if this string could exceed 100 characters, i.e. if all test toggle values were false.
  // This is a bit of a hack due to GA limiting the amount of characters we can send.
  // If it turns into a problem we may need to revisit, but I'm hoping this is a practical solution.
  if (potentialToggleString.length > 100) {
    throw new Error(
      `The combined test toggle ids have too many characters to be sent to Google Analytics.\n
      The maximum is 100 characters, we would be sending ${potentialToggleString.length} characters.\n
      Check if any toggles are no longer required and can be removed and/or shorten the new id.\n`
    );
  }

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
