import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react';

import { KioskExperienceId, KioskModeOptionId } from '@weco/toggles';
import toggleConfig from '@weco/toggles/toggles';

// Human-readable names for each kiosk experience
export const kioskExperienceNames = {
  developerMode: 'Developer mode',
  tendernessAndRage: 'Tenderness and Rage',
  readingRoom: 'Reading Room',
} as const;

// Valid kiosk mode IDs extracted from toggles config
const VALID_KIOSK_MODE_IDS =
  toggleConfig.modes
    .find(mode => mode.id === 'kioskMode')
    ?.options.map(option => option.id) ?? [];

/**
 * Validates that a cookie value is a valid kiosk mode option ID.
 * Use this server-side to validate the toggle_kioskMode cookie before using it.
 */
export function isValidKioskMode(value: unknown): value is KioskModeOptionId {
  return (
    typeof value === 'string' &&
    (VALID_KIOSK_MODE_IDS as readonly string[]).includes(value)
  );
}

type KioskExperienceName =
  (typeof kioskExperienceNames)[keyof typeof kioskExperienceNames];

type KioskContextType = {
  isKiosk: boolean;
  isDevModeKiosk: boolean;
  isTendernessAndRageKiosk: boolean;
  isReadingRoomKiosk: boolean;
  kioskExperienceName?: KioskExperienceName; // Human-readable name of the current kiosk experience
  kioskHomepageUrl?: string;
};

type KioskProviderProps = PropsWithChildren<{
  cookieContent: string | null;
}>;

const KioskContext = createContext<KioskContextType>({
  isKiosk: false,
  isDevModeKiosk: false,
  isTendernessAndRageKiosk: false,
  isReadingRoomKiosk: false,
});

export const useKiosk = (): KioskContextType => {
  const contextState = useContext(KioskContext);
  return contextState;
};

/**
 * Extracts the human-readable experience name from a kiosk cookie value.
 * Cookie format is either 'devMode' or '{prefix}-{deviceId}' (e.g. 'RR-iPad1').
 */
export const getKioskExperienceName = (
  cookieContent: string | null
): KioskExperienceName | undefined => {
  if (!cookieContent) return undefined;

  // Extract experience prefix: 'RR-iPad1' → 'RR', 'devMode' → 'devMode'
  const experienceId = cookieContent.split('-')[0] as KioskExperienceId;

  switch (experienceId) {
    case 'RR':
      return kioskExperienceNames.readingRoom;
    case 'TR':
      return kioskExperienceNames.tendernessAndRage;
    case 'devMode':
      return kioskExperienceNames.developerMode;
    default:
      return undefined;
  }
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
