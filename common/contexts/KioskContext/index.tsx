import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import {
  kiosksContent as initialKiosksContent,
  KioskContent,
} from '@weco/common/contexts/KioskContext/kiosk';
import { ReadingRoomStories } from '@weco/common/server-data/prismic';

type KioskExperienceName = 'Tenderness and Rage' | 'Reading Room';

type KioskContextType = {
  isKiosk: boolean;
  isTendernessAndRageKiosk: boolean;
  isReadingRoomKiosk: boolean;
  kioskExperienceName?: KioskExperienceName;
  kiosksContent: Record<string, KioskContent>;
  kioskHomeUrl: string;
};

const KioskContext = createContext<KioskContextType>({
  isKiosk: false,
  isTendernessAndRageKiosk: false,
  isReadingRoomKiosk: false,
  kiosksContent: initialKiosksContent,
  kioskHomeUrl: '/',
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
  const experienceId = cookieContent?.split('-')[0];

  // Merge server-fetched data with hardcoded content
  const kiosksContent = useMemo(
    () => ({
      ...initialKiosksContent,
      RR: {
        ...initialKiosksContent.RR,
        ...readingRoomStories,
      },
    }),
    [readingRoomStories]
  );

  const kioskHomeUrl = experienceId
    ? initialKiosksContent[experienceId]?.homeUrl || '/'
    : '/';

  const value = useMemo(
    () => ({
      isKiosk: !!cookieContent,
      kioskExperienceName: experienceName,
      isTendernessAndRageKiosk: experienceName === 'Tenderness and Rage',
      isReadingRoomKiosk: experienceName === 'Reading Room',
      kiosksContent,
      kioskHomeUrl,
    }),
    [experienceName, kiosksContent, kioskHomeUrl]
  );

  return (
    <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
  );
};

export const useKiosksContent = (): Record<string, KioskContent> => {
  const { kiosksContent } = useContext(KioskContext);
  return kiosksContent;
};
