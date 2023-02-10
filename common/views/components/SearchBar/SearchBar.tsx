import {
  FunctionComponent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import TextInput from '@weco/common/views/components/TextInput/TextInput';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { themeValues } from '@weco/common/views/themes/config';
import ButtonSolidLink from '@weco/common/views/components/ButtonSolidLink/ButtonSolidLink';
import ClearSearch from '@weco/common/views/components/ClearSearch/ClearSearch';
import { getQueryPropertyValue } from '@weco/common/utils/search';

const Container = styled.div`
  display: flex;
  align-items: center;
`;
const SearchInputWrapper = styled.div`
  flex: 1 1 auto;

  position: relative;
  font-size: 20px;
  margin-right: 10px;

  .search-query {
    height: ${props => 10 * props.theme.spacingUnit}px;
  }
`;

const SearchButtonWrapper = styled.div`
  flex: 0 1 auto;
`;
type Props = {
  placeholder: string;
  id?: string;
  isGlobalSearch?: boolean;
};

const SearchBar: FunctionComponent<Props> = ({
  placeholder,
  id,
  isGlobalSearch,
}) => {
  const router = useRouter();
  const routerQuery = getQueryPropertyValue(router?.query?.query);
  const [inputQuery, setInputQuery] = useState((routerQuery as string) || '');
  const searchInput = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      document.getElementById('global-search-submit')?.click();
    }
  };

  useEffect(() => {
    if (routerQuery && routerQuery !== inputQuery) {
      setInputQuery(routerQuery);
    }
  }, [routerQuery]);

  return (
    <Container>
      <SearchInputWrapper>
        <TextInput
          id={id || 'search-searchbar'}
          label={placeholder}
          name="query"
          type="search"
          value={inputQuery}
          setValue={setInputQuery}
          ref={searchInput}
          form="searchPageForm"
          big={true}
          onKeyDown={handleKeyDown}
        />
        {inputQuery && (
          <ClearSearch
            inputRef={searchInput}
            setValue={setInputQuery}
            gaEvent={{
              category: 'SearchForm',
              action: 'clear search',
              label: 'search',
            }}
            right={16}
          />
        )}
      </SearchInputWrapper>
      <SearchButtonWrapper>
        {isGlobalSearch ? (
          <ButtonSolidLink
            text="Search"
            size="large"
            id="global-search-submit"
            colors={themeValues.buttonColors.yellowYellowBlack}
            link={{
              href: {
                // TODO if released before the redirect is in placeholder, link to /works instead
                pathname: '/search',
                ...(inputQuery && { query: { query: inputQuery } }),
              },
            }}
          />
        ) : (
          <ButtonSolid
            text="Search"
            type={ButtonTypes.submit}
            size="large"
            form="searchPageForm"
            colors={themeValues.buttonColors.yellowYellowBlack}
          />
        )}
      </SearchButtonWrapper>
    </Container>
  );
};

export default SearchBar;
