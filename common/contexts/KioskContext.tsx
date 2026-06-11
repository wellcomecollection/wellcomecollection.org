import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import { ReadingRoomStories } from '@weco/common/server-data/prismic';

import { kiosksContent as initialKiosksContent, KioskContent } from './kiosk';

type KioskContextType = {
  isKiosk: boolean;
  kiosksContent: Record<string, KioskContent>;
};

const KioskContext = createContext<KioskContextType>({
  isKiosk: false,
  kiosksContent: initialKiosksContent,
});

type KioskProviderProps = PropsWithChildren<{
  isActive: boolean;
  readingRoomStories: ReadingRoomStories;
}>;

export const KioskProvider: FunctionComponent<KioskProviderProps> = ({
  isActive,
  readingRoomStories,
  children,
}) => {
  // Merge server-fetched data with hardcoded content
  const kiosksContent = useMemo(
    () => ({
      ...initialKiosksContent,
      RR: readingRoomStories,
    }),
    [readingRoomStories]
  );

  const value = useMemo(
    () => ({ isKiosk: isActive, kiosksContent }),
    [isActive, kiosksContent]
  );

  return (
    <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
  );
};

export const useKiosk = (): boolean => {
  const { isKiosk } = useContext(KioskContext);
  return isKiosk;
};

export const useKiosksContent = (): Record<string, KioskContent> => {
  const { kiosksContent } = useContext(KioskContext);
  return kiosksContent;
};
