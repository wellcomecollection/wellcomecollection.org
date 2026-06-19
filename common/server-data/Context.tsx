import { createContext, useContext } from 'react';

import { FeatureFlags, Modes, Tests } from '@weco/toggles';

import { SimplifiedPrismicData } from './prismic';
import { defaultServerData, ServerData } from './types';

/**
 * `AppData` is data that we retrieve from ServerData (data cached on the filesystem)
 * and make available via `Context`
 */
export const ServerDataContext = createContext<ServerData>(defaultServerData);

/**
 * These are convenience methods to access properties off ServerData
 * without having to decontruct it. i.e.
 * This:
 * `const { featureFlagName } = useFeatureFlags()`
 * Over:
 * `const { toggles: { featureFlagName } } = useContext(ServerDataContext)`
 */

export const useFeatureFlags = (): FeatureFlags => {
  const data = useContext(ServerDataContext);
  return data.toggles.featureFlags;
};

export const useABTest = (): Tests => {
  const data = useContext(ServerDataContext);
  return data.toggles.tests;
};

export const useModes = (): Modes => {
  const data = useContext(ServerDataContext);
  return data.toggles.modes;
};

export const usePrismicData = (): SimplifiedPrismicData => {
  const data = useContext(ServerDataContext);
  return data.prismic;
};
