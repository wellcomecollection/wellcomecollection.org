import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react';

type KioskExperience = 'TendernessAndRage' | 'ReadingRoom';

type KioskContextType = {
  isKiosk: boolean;
  experience?: KioskExperience;
};

const KioskContext = createContext<KioskContextType>({ isKiosk: false });

type KioskProviderProps = PropsWithChildren<{
  cookieContent: string | null;
}>;

export const useKiosk = (): KioskContextType => {
  const contextState = useContext(KioskContext);
  return contextState;
};

export const KioskProvider: FunctionComponent<KioskProviderProps> = ({
  cookieContent,
  children,
}) => {
  const experienceId = cookieContent?.split('-')[0];
  let experienceName: KioskExperience | undefined;

  switch (experienceId) {
    case 'RR':
      experienceName = 'ReadingRoom';
      break;
    case 'TR':
      experienceName = 'TendernessAndRage';
      break;
    default:
      break;
  }

  return (
    <KioskContext.Provider
      value={{ isKiosk: !!cookieContent, experience: experienceName }}
    >
      {children}
    </KioskContext.Provider>
  );
};
