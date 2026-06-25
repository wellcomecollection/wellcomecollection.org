import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import {
  kiosksContent as initialKiosksContent,
  kioskExperienceNames,
  KiosksContentType,
} from '@weco/common/contexts/KioskContext/kiosks-content';
import { ReadingRoomStories } from '@weco/common/server-data/prismic';
import { KioskExperienceId, KioskModeOptionId } from '@weco/toggles';
import toggleConfig from '@weco/toggles/toggles';

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
  kiosksContent: Record<string, KiosksContentType>;
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

export const getKioskContentKey = (
  kioskMode: string | null,
  kiosksContent: Record<string, KiosksContentType>
): string | null => {
  if (!kioskMode) return null;

  // Find the content key that matches the kioskMode prefix (e.g., "TR" from "TR-iPad1")
  const contentKey = Object.keys(kiosksContent).find(prefix =>
    kioskMode.startsWith(prefix)
  );

  return contentKey || null;
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
      RR: readingRoomStories as KiosksContentType,
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

export const useKiosksContent = (): Record<string, KiosksContentType> => {
  const { kiosksContent } = useKiosk();
  return kiosksContent;
};

export { kioskExperienceNames };
