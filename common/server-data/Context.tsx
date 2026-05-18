import { createContext, useContext } from 'react';

import { FeatureFlagId, ModeId, TestId } from '@weco/toggles';

import { SimplifiedPrismicData } from './prismic';
import { defaultServerData, SimplifiedServerData } from './types';

/**
 * `AppData` is data that we retrieve from ServerData (data cached on the filesystem)
 * and make available via `Context`
 */
export const ServerDataContext =
  createContext<SimplifiedServerData>(defaultServerData);

/**
 * These are convenience methods to access properties off ServerData
 * without having to decontruct it. i.e.
 * This:
 * `const { featureFlagName } = useFeatureFlags()`
 * Over:
 * `const { toggles: { featureFlagName } } = useContext(ServerDataContext)`
 */

type FeatureFlagValue = Record<FeatureFlagId, boolean | undefined>;
type TestValue = Record<TestId, boolean | undefined>;
type ModeValue = Record<ModeId, Record<string, unknown> | undefined>;
type FeatureFlagAndTestValues = FeatureFlagValue & TestValue;

export const useFeatureFlags = (): FeatureFlagValue => {
  const data = useContext(ServerDataContext);
  return Object.keys(data.toggles)
    .filter(
      key =>
        data.toggles[key as FeatureFlagId].type !== 'test' &&
        data.toggles[key as FeatureFlagId].type !== 'mode'
    )
    .reduce((acc, key) => {
      acc[key as FeatureFlagId] = (
        data.toggles[key as FeatureFlagId] as { value: boolean | undefined }
      ).value;
      return acc;
    }, {} as FeatureFlagValue);
};

export const useTests = (): TestValue => {
  const data = useContext(ServerDataContext);
  return Object.keys(data.toggles)
    .filter(key => data.toggles[key as TestId].type === 'test')
    .reduce((acc, key) => {
      acc[key as TestId] = (
        data.toggles[key as TestId] as { value: boolean | undefined }
      ).value;
      return acc;
    }, {} as TestValue);
};

/**
 * Returns both feature flags and tests combined (legacy convenience function).
 * Prefer useFeatureFlags() or useTests() for new code.
 * @deprecated Use useFeatureFlags() or useTests() instead
 */
export const useToggles = (): FeatureFlagAndTestValues => {
  const featureFlags = useFeatureFlags();
  const tests = useTests();
  return { ...featureFlags, ...tests };
};

export const useModes = (): ModeValue => {
  const data = useContext(ServerDataContext);
  return Object.keys(data.toggles)
    .filter(key => data.toggles[key as ModeId].type === 'mode')
    .reduce((acc, key) => {
      acc[key as ModeId] = (
        data.toggles[key as ModeId] as {
          value: Record<string, unknown> | undefined;
        }
      ).value;
      return acc;
    }, {} as ModeValue);
};

export const usePrismicData = (): SimplifiedPrismicData => {
  const data = useContext(ServerDataContext);
  return data.prismic;
};
