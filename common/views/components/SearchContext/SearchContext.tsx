import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useState,
} from 'react';
import { LinkProps } from '@weco/common/model/link-props';

const defaultLink = {
  href: {
    pathname: '/search/works',
  },
  as: {
    pathname: '/search/works',
  },
};

const SearchContext = createContext<{
  link: LinkProps;
  setLink: (link: LinkProps) => void;
}>({
  link: defaultLink,
  setLink: link => link,
});

export const SearchContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [searchLink, setSearchLink] = useState<LinkProps>(defaultLink);

  return (
    <SearchContext.Provider
      value={{
        link: searchLink,
        setLink: link => {
          setSearchLink(link);
        },
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
