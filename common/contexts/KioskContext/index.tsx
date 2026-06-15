import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react';

import { ReadingRoomStories } from '@weco/common/server-data/prismic';

import { kiosksContent as initialKiosksContent, KioskContent } from './kiosk';

type KioskExperienceName = 'Tenderness and Rage' | 'Reading Room';

type KioskContextType = {
  isKiosk: boolean;
  isTendernessAndRageKiosk: boolean;
  isReadingRoomKiosk: boolean;
  kioskExperienceName?: KioskExperienceName;
  kiosksContent: Record<string, KioskContent>;
};

const KioskContext = createContext<KioskContextType>({
  isKiosk: false,
  isTendernessAndRageKiosk: false,
  isReadingRoomKiosk: false,
  kiosksContent: initialKiosksContent,
});

type KioskProviderProps = PropsWithChildren<{
  cookieContent: string | null;
  readingRoomStories: ReadingRoomStories;
}>;

export const useKiosk = (): KioskContextType => {
  const contextState = useContext(KioskContext);
  return contextState;
};

export const getKioskExperienceName = (
  cookieContent: string | null
): KioskExperienceName | undefined => {
  if (!cookieContent) return undefined;

  const experienceId = cookieContent.split('-')[0];

  switch (experienceId) {
    case 'RR':
      return 'Reading Room';
    case 'TR':
      return 'Tenderness and Rage';
    default:
      break;
  }

  return undefined;
};

export const KioskProvider: FunctionComponent<KioskProviderProps> = ({
  cookieContent,
  readingRoomStories,
  children,
}) => {
  const experienceName = getKioskExperienceName(cookieContent);

  // Merge server-fetched data with hardcoded content
  const kiosksContent = useMemo(
    () => ({
      ...initialKiosksContent,
      RR: readingRoomStories,
    }),
    [readingRoomStories]
  );

  const value = useMemo(
    () => ({
      isKiosk: !!cookieContent,
      kioskExperienceName: experienceName,
      isTendernessAndRageKiosk: experienceName === 'Tenderness and Rage',
      isReadingRoomKiosk: experienceName === 'Reading Room',
      kiosksContent,
    }),
    [isActive, kiosksContent]
  );

  return (
    <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
  );
};

export const useKiosksContent = (): Record<string, KioskContent> => {
  const { kiosksContent } = useContext(KioskContext);
  return kiosksContent;
};
