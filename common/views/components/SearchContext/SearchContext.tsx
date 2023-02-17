import { createContext, FunctionComponent, useState } from 'react';
import { LinkProps } from '../../../model/link-props';

const defaultLink = {
  href: {
    pathname: '/works',
  },
  as: {
    pathname: '/works',
  },
};

const SearchContext = createContext<{
  link: LinkProps;
  setLink: (link: LinkProps) => void;
}>({
  link: defaultLink,
  setLink: link => link,
});

export const SearchContextProvider: FunctionComponent = ({ children }) => {
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
