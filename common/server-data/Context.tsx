import { createContext, useContext } from 'react';
import { defaultServerData, SimplifiedServerData } from './types';
import { SimplifiedPrismicData } from './prismic';
import { ToggleId, TestId } from '@weco/toggles';

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
 * `const { toggleName } = useToggles()`
 * Over:
 * `const { toggles: { toggleName } } = useContext(ServerDataContext)`
 */

type ClientToggleValues = Record<ToggleId | TestId, boolean | undefined>;

export const useToggles = (): ClientToggleValues => {
  const data = useContext(ServerDataContext);
  const toggles = Object.keys(data.toggles).reduce((acc, key) => {
    acc[key] = data.toggles[key].value;
    return acc;
  }, {});
  return toggles;
};

export const usePrismicData = (): SimplifiedPrismicData => {
  const data = useContext(ServerDataContext);
  return data.prismic;
};
