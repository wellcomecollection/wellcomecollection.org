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
import { KioskExperienceId } from '@weco/toggles';

export const kioskExperienceNames = {
  developerMode: 'Developer mode',
  tendernessAndRage: 'Tenderness and Rage',
  readingRoom: 'Reading Room',
} as const;

type KioskExperienceName =
  (typeof kioskExperienceNames)[keyof typeof kioskExperienceNames];

type KioskContextType = {
  isKiosk: boolean;
  isDevModeKiosk: boolean;
  isTendernessAndRageKiosk: boolean;
  isReadingRoomKiosk: boolean;
  kioskExperienceName?: KioskExperienceName;
  kioskHomepageUrl?: string;
  kiosksContent: Record<string, KioskContent>;
};

const KioskContext = createContext<KioskContextType>({
  isKiosk: false,
  isDevModeKiosk: false,
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

  const experienceId = cookieContent.split('-')[0] as KioskExperienceId;

  switch (experienceId) {
    case 'RR':
      return kioskExperienceNames.readingRoom;
    case 'TR':
      return kioskExperienceNames.tendernessAndRage;
    case 'devMode':
      return kioskExperienceNames.developerMode;
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
  const kioskExperienceName = getKioskExperienceName(cookieContent);

  const isDevModeKiosk =
    kioskExperienceName === kioskExperienceNames.developerMode;
  const isTendernessAndRageKiosk =
    kioskExperienceName === kioskExperienceNames.tendernessAndRage;
  const isReadingRoomKiosk =
    kioskExperienceName === kioskExperienceNames.readingRoom;

  const kioskHomepageUrl = isTendernessAndRageKiosk
    ? '/exhibitions/tenderness-and-rage/explore-more'
    : isReadingRoomKiosk
      ? '/stories/kiosk'
      : undefined;

  const kiosksContent = useMemo(
    () => ({
      ...initialKiosksContent,
      RR: readingRoomStories as KioskContent,
    }),
    [readingRoomStories]
  );

  const value = useMemo(
    () => ({
      isKiosk: !!cookieContent,
      kioskExperienceName,
      isDevModeKiosk,
      isTendernessAndRageKiosk,
      isReadingRoomKiosk,
      kioskHomepageUrl,
      kiosksContent,
    }),
    [kioskExperienceName, kiosksContent]
  );

  return (
    <KioskContext.Provider value={value}>{children}</KioskContext.Provider>
  );
};

export const useKiosksContent = (): Record<string, KioskContent> => {
  const { kiosksContent } = useKiosk();
  return kiosksContent;
};
