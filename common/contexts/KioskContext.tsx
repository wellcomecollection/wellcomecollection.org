import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react';

import { exhibitionKioskContent, ExhibitionKioskData } from './exhibition';

type KioskContextType = {
  isKiosk: boolean;
  kioskData: Record<string, ExhibitionKioskData>;
};

const KioskContext = createContext<KioskContextType>({
  isKiosk: false,
  kioskData: exhibitionKioskContent,
});

type KioskProviderProps = PropsWithChildren<{
  isActive: boolean;
}>;

export const KioskProvider: FunctionComponent<KioskProviderProps> = ({
  isActive,
  children,
}) => {
  return (
    <KioskContext.Provider
      value={{ isKiosk: isActive, kioskData: exhibitionKioskContent }}
    >
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = (): boolean => {
  const { isKiosk } = useContext(KioskContext);
  return isKiosk;
};

export const useKioskData = (): Record<string, ExhibitionKioskData> => {
  const { kioskData } = useContext(KioskContext);
  return kioskData;
};
