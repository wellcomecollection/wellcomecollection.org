import {
  createContext,
  useState,
  FunctionComponent,
  PropsWithChildren,
} from 'react';

type WorkContextProps = {
  isFetchingIIIFManifest: boolean;
  setIsFetchingIIIFManifest: (isFetching: boolean) => void;
};

const workContextDefaults = {
  isFetchingIIIFManifest: true,
  setIsFetchingIIIFManifest: () => null,
};

export const WorkContext = createContext<WorkContextProps>(workContextDefaults);

export const WorkContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [isFetchingIIIFManifest, setIsFetchingIIIFManifest] = useState(true);

  return (
    <WorkContext.Provider
      value={{
        isFetchingIIIFManifest,
        setIsFetchingIIIFManifest,
      }}
    >
      {children}
    </WorkContext.Provider>
  );
};
