import { createContext, useContext } from 'react';

import { FeatureFlagId, TestId } from '@weco/toggles';

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
type ABTestValue = Record<TestId, boolean | undefined>;

export const useFeatureFlags = (): FeatureFlagValue => {
  const data = useContext(ServerDataContext);
  return Object.keys(data.toggles)
    .filter(key => data.toggles[key].type !== 'test')
    .reduce((acc, key) => {
      acc[key as FeatureFlagId] = data.toggles[key].value;
      return acc;
    }, {} as FeatureFlagValue);
};

export const useABTest = (): ABTestValue => {
  const data = useContext(ServerDataContext);
  return Object.keys(data.toggles)
    .filter(key => data.toggles[key].type === 'test')
    .reduce((acc, key) => {
      acc[key as TestId] = data.toggles[key].value;
      return acc;
    }, {} as ABTestValue);
};

export const usePrismicData = (): SimplifiedPrismicData => {
  const data = useContext(ServerDataContext);
  return data.prismic;
};
