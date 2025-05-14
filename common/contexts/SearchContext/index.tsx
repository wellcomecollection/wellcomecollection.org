import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

import { LinkProps } from '@weco/common/model/link-props';
import { ApiToolbarLink } from '@weco/common/views/components/ApiToolbar';

const defaultLink = {
  href: {
    pathname: '/search/works',
  },
  as: {
    pathname: '/search/works',
  },
};

type Props = {
  link: LinkProps;
  setLink: (link: LinkProps) => void;
  extraApiToolbarLinks: ApiToolbarLink[];
  setExtraApiToolbarLinks: (toolbarLinks: ApiToolbarLink[]) => void;
};

const SearchContext = createContext<Props>({
  link: defaultLink,
  setLink: link => link,
  extraApiToolbarLinks: [],
  setExtraApiToolbarLinks: () => null,
});

export function useSearchContext(): Props {
  const contextState = useContext(SearchContext);
  return contextState;
}

export const SearchContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [searchLink, setSearchLink] = useState<LinkProps>(defaultLink);
  const [extraApiToolbarLinks, setExtraApiToolbarLinks] = useState<
    ApiToolbarLink[]
  >([]);

  return (
    <SearchContext.Provider
      value={{
        link: searchLink,
        setLink: link => {
          setSearchLink(link);
        },
        extraApiToolbarLinks,
        setExtraApiToolbarLinks,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
