import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';

import {
  getKioskContentKey,
  getKioskExperienceName,
  kiosksContent as initialKiosksContent,
  KioskExperienceName,
  kioskExperienceNames,
  KiosksContentType,
} from '@weco/common/contexts/KioskContext/kiosks-content';
import { HistoryProvider } from '@weco/common/hooks/useNavigationHistory';
import {
  ReadingRoomStories,
  TendernessAndRageContent,
} from '@weco/common/server-data/prismic';
import { KioskModeOptionId } from '@weco/toggles';
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
  tendernessAndRageContent: TendernessAndRageContent;
}>;

export const useKiosk = (): KioskContextType => {
  const contextState = useContext(KioskContext);
  return contextState;
};

export const KioskProvider: FunctionComponent<KioskProviderProps> = ({
  cookieContent,
  readingRoomStories,
  tendernessAndRageContent,
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
      TR: {
        ...initialKiosksContent.TR,
        ...(tendernessAndRageContent ?? {}),
      } as KiosksContentType,
    }),
    [readingRoomStories, tendernessAndRageContent]
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
    <KioskContext.Provider value={value}>
      <HistoryProvider>{children}</HistoryProvider>
    </KioskContext.Provider>
  );
};

export const useKiosksContent = (): Record<string, KiosksContentType> => {
  const { kiosksContent } = useKiosk();
  return kiosksContent;
};

export { getKioskContentKey, getKioskExperienceName, kioskExperienceNames };
