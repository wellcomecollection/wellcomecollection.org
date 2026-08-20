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

  // HistoryProvider (kiosk prev/next navigation history) safely lives here, wrapping KioskProvider's
  // own children, because this module is no longer reachable from the identity app at all -
  // isValidKioskMode (the one thing identity needed from here, via AppContext/civic-uk.ts) now has
  // its own tiny module (./is-valid-kiosk-mode) instead of going through this barrel.
  //
  // History: this used to matter a lot. HistoryProvider previously lived here too, and it broke
  // identity's build with "Error: Invariant: AsyncLocalStorage accessed in runtime where it is not
  // available", even though identity never sets kiosk mode - because AppContext (used by identity's
  // IdentityPageLayout on every page) imported isValidKioskMode from this same file, so anything
  // else imported here (including HistoryProvider's next/router + sessionStorage code) rode along
  // into identity's build too, conflicting with identity's Edge middleware (nextjs-auth0 v4) and its
  // use of AsyncLocalStorage. HistoryProvider got moved out to _app.tsx as a workaround at the time,
  // wrapped in next/dynamic with ssr:false - which introduced a separate bug, since that meant
  // nothing rendered at all for the subtree it wrapped (i.e. the whole page) until the client-side
  // chunk loaded, defeating KioskPro's configured browser zoom level on kiosk pages. Once we found
  // the actual cause of the identity crash, we fixed it at the source instead (the isValidKioskMode
  // extraction above) and moved HistoryProvider back here, which is a more natural home for it
  // anyway - no next/dynamic, no ssr option to get wrong, just a plain import. Verified by literally
  // reproducing the identity crash with HistoryProvider here before the extraction, and confirming
  // it's gone after.
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
