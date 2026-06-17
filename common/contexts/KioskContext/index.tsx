import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react';

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
};

const KioskContext = createContext<KioskContextType>({
  isKiosk: false,
  isDevModeKiosk: false,
  isTendernessAndRageKiosk: false,
  isReadingRoomKiosk: false,
});

type KioskProviderProps = PropsWithChildren<{
  cookieContent: string | null;
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

  return (
    <KioskContext.Provider
      value={{
        isKiosk: !!cookieContent,
        kioskExperienceName,
        isDevModeKiosk,
        isTendernessAndRageKiosk,
        isReadingRoomKiosk,
        kioskHomepageUrl,
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};
