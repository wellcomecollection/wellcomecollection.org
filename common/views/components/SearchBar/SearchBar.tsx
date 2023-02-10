import { FunctionComponent, useContext, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import TextInput from '@weco/common/views/components/TextInput/TextInput';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { themeValues } from '@weco/common/views/themes/config';

import ClearSearch from '@weco/common/views/components/ClearSearch/ClearSearch';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

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

const SearchBar: FunctionComponent<{ placeholder: string }> = ({
  placeholder,
}) => {
  const { query } = useRouter();
  const { isEnhanced } = useContext(AppContext);
  const [inputQuery, setInputQuery] = useState((query.query as string) || '');
  const searchInput = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <SearchInputWrapper>
        <TextInput
          id="search-searchbar"
          label={placeholder}
          name="query"
          type="search"
          value={inputQuery}
          setValue={setInputQuery}
          ref={searchInput}
          form="searchPageForm"
          big={true}
        />
        {inputQuery && isEnhanced && (
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
        <ButtonSolid
          text="Search"
          type={ButtonTypes.submit}
          size="large"
          form="searchPageForm"
          colors={themeValues.buttonColors.yellowYellowBlack}
        />
      </SearchButtonWrapper>
    </Container>
  );
};

export default SearchBar;
