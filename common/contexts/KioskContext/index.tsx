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

export type KioskContextType = {
  isKiosk: boolean;
  isDevModeKiosk: boolean;
  isTendernessAndRageKiosk: boolean;
  isReadingRoomKiosk: boolean;
  kioskExperienceName?: KioskExperienceName; // Human-readable name of the current kiosk experience
  kioskHomepageUrl?: string;
  kiosksContent: Record<string, KiosksContentType>;
};

export const defaultKioskContext: KioskContextType = {
  isKiosk: false,
  isDevModeKiosk: false,
  isTendernessAndRageKiosk: false,
  isReadingRoomKiosk: false,
  kiosksContent: initialKiosksContent,
};

const KioskContext = createContext<KioskContextType>(defaultKioskContext);

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

export default KioskContext;
export { getKioskContentKey, getKioskExperienceName, kioskExperienceNames };
