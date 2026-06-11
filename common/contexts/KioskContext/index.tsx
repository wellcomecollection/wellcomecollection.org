import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react';

type KioskExperienceName =
  | 'Developer mode'
  | 'Tenderness and Rage'
  | 'Reading Room';

type KioskContextType = {
  isKiosk: boolean;
  isDevModeKiosk: boolean;
  isTendernessAndRageKiosk: boolean;
  isReadingRoomKiosk: boolean;
  kioskExperienceName?: KioskExperienceName;
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

  const experienceId = cookieContent.split('-')[0];

  switch (experienceId) {
    case 'RR':
      return 'Reading Room';
    case 'TR':
      return 'Tenderness and Rage';
    case 'devMode':
      return 'Developer mode';
    default:
      break;
  }

  return undefined;
};

export const KioskProvider: FunctionComponent<KioskProviderProps> = ({
  cookieContent,
  children,
}) => {
  const experienceName = getKioskExperienceName(cookieContent);

  return (
    <KioskContext.Provider
      value={{
        isKiosk: !!cookieContent,
        kioskExperienceName: experienceName,
        isDevModeKiosk: experienceName === 'Developer mode',
        isTendernessAndRageKiosk: experienceName === 'Tenderness and Rage',
        isReadingRoomKiosk: experienceName === 'Reading Room',
      }}
    >
      {children}
    </KioskContext.Provider>
  );
};
