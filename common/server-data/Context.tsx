import { createContext, useContext } from 'react';
import { defaultServerData, ServerData } from './types';
import { PrismicData } from './prismic';
import { Toggles } from '@weco/toggles';

/**
 * `AppData` is data that we retrieve from ServerData (data cached on the filesystem)
 * and make available via `Context`
 */
export const ServerDataContext = createContext<ServerData>(defaultServerData);

/**
 * These are convenience methods to access properties off ServerData
 * without having to decontruct it. i.e.
 * This:
 * `const { toggleName } = useToggles()`
 * Over:
 * `const { toggles: { toggleName } } = useContext(ServerDataContext)`
 */
export const useToggles = (): Toggles => {
  const data = useContext(ServerDataContext);
  return data.toggles;
};

export const usePrismicData = (): PrismicData => {
  const data = useContext(ServerDataContext);
  return data.prismic;
};
