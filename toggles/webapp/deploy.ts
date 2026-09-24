import { S3Client } from '@aws-sdk/client-s3';
import { info } from 'console';

import { TogglesResp } from '.';
import { getTogglesObject, putTogglesObject } from './s3-utils';
import localToggles, {
  FeatureFlagDefinition,
  ModeDefinition,
  PublishedFeatureFlag,
  PublishedMode,
} from './toggles';

export const withDefaultValuesUnmodified = (
  publishedToggles: PublishedFeatureFlag[],
  definitions: FeatureFlagDefinition[]
): PublishedFeatureFlag[] => {
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
    const isNew = typeof matchingToggle === 'undefined';

    if (!isNew && matchingToggle.defaultValue !== toggle.initialValue) {
      info(
        `${toggle.id}: the published value is ${matchingToggle.defaultValue} and will not be replaced`
      );
      info(`If you want to update the published value, run:`);
      info(`    yarn setDefaultValueFor --${toggle.id}=${toggle.initialValue}`);
      info('');
    }

    const defaultValue = isNew
      ? toggle.initialValue
      : matchingToggle.defaultValue;

    // Only set dates for experimental toggles
    const isExperimental = toggle.type === 'experimental';

    // Set dateCreated only when the toggle first appears in S3 (experimental toggles only).
    const dateCreated = isExperimental
      ? (matchingToggle?.dateCreated ?? new Date().toISOString())
      : undefined;

    // Set dateActivated only when the deployed toggle is actually active (experimental toggles only).
    const dateActivated =
      isExperimental && defaultValue
        ? (matchingToggle?.dateActivated ?? new Date().toISOString())
        : undefined;

    const { initialValue, ...otherFields } = toggle;

    return {
      ...otherFields,
      defaultValue,
      // Omit rather than set undefined, so a non-experimental toggle's
      // published shape doesn't carry these keys at all.
      ...(dateCreated !== undefined && { dateCreated }),
      ...(dateActivated !== undefined && { dateActivated }),
    };
  });
};

/**
 * Like withDefaultValuesUnmodified, for phased modes: their public default and
 * (experimental only) rollout dates survive redeploys. Other modes never carry any.
 */
export const withModeDefaultsUnmodified = (
  publishedModes: PublishedMode[],
  definitions: ModeDefinition[]
): PublishedMode[] =>
  definitions.map(mode => {
    if (!mode.phased) return mode;
    const published = publishedModes.find(({ id }) => id === mode.id);
    const defaultValue = published?.defaultValue;
    const isExperimental = mode.type === 'experimental';

    return {
      ...mode,
      ...(defaultValue && { defaultValue }),
      ...(isExperimental && {
        dateCreated: published?.dateCreated ?? new Date().toISOString(),
      }),
      ...(isExperimental &&
        defaultValue && {
          dateActivated: published?.dateActivated ?? new Date().toISOString(),
        }),
    };
  });

export async function deploy(client: S3Client): Promise<void> {
  // Check for duplicate IDs across feature flags, tests, and modes
  const allIds = [
    ...localToggles.featureFlags.map(f => f.id),
    ...localToggles.tests.map(t => t.id),
    ...localToggles.modes.map(m => m.id),
  ];
  const duplicates = allIds.filter((id, index) => allIds.indexOf(id) !== index);
  if (duplicates.length > 0) {
    throw new Error(
      `Duplicate toggle IDs found across feature flags, tests, and modes: ${duplicates.join(', ')}. ` +
        `All IDs must be unique because they share the toggle_ cookie prefix.`
    );
  }

  const remoteToggles = await getTogglesObject(client);
  const remoteFeatureFlags = remoteToggles.featureFlags ?? [];

  const featureFlagsToDeploy = withDefaultValuesUnmodified(remoteFeatureFlags, [
    ...localToggles.featureFlags,
  ]);

  // We don't bother looking at the `.tests` during deployments as the `defaultValue`s
  // don't do anything as values are randomly assigned.
  // We should probably look at the structure of features vs tests.
  const toggles: TogglesResp = {
    featureFlags: featureFlagsToDeploy,
    tests: localToggles.tests,
    modes: withModeDefaultsUnmodified(remoteToggles.modes ?? [], [
      ...localToggles.modes,
    ]),
  };

  // GA4 now limits event parameter values to 100 characters: https://support.google.com/analytics/answer/9267744?hl=en
  // So instead of sending the whole toggles JSON blob we send a concatenated string of only the toggle names (preceeded with a ! if the toggle is false).
  const potentialToggleString = toggles.tests
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
    toggles
  );

  if (putObjectResponseMetadata.httpStatusCode === 200) {
    console.info(`Success!`);
  } else {
    throw new Error(`Error putting toggles in S3 ${putObjectResponseMetadata}`);
  }
}
