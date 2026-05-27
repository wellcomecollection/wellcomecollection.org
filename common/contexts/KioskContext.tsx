import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
} from 'react';

type KioskContextType = {
  isKiosk: boolean;
};

const KioskContext = createContext<KioskContextType>({ isKiosk: false });

type KioskProviderProps = PropsWithChildren<{
  isActive: boolean;
}>;

export const KioskProvider: FunctionComponent<KioskProviderProps> = ({
  isActive,
  children,
}) => {
  return (
    <KioskContext.Provider value={{ isKiosk: isActive }}>
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = (): boolean => {
  const { isKiosk } = useContext(KioskContext);
  return isKiosk;
};
