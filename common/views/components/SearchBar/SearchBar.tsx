import {
  FunctionComponent,
  RefObject,
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
  form: string;
  inputRef?: RefObject<HTMLInputElement>;
};

const SearchBar: FunctionComponent<Props> = ({
  placeholder,
  form,
  inputRef,
}) => {
  const router = useRouter();
  const routerQuery = getQueryPropertyValue(router?.query?.query);
  const [inputQuery, setInputQuery] = useState(routerQuery || '');
  const defaultInputRef = useRef<HTMLInputElement>(null);

  // This account for pages that could have multiple versions of the SearchBar
  // as the global search also displays on search pages.
  useEffect(() => {
    if (routerQuery && routerQuery !== inputQuery) {
      setInputQuery(routerQuery);
    }
  }, [routerQuery]);

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
          ref={inputRef || defaultInputRef}
          form={form}
          big={true}
        />
        {inputQuery && (
          <ClearSearch
            inputRef={inputRef || defaultInputRef}
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
          form={form}
          colors={themeValues.buttonColors.yellowYellowBlack}
        />
      </SearchButtonWrapper>
    </Container>
  );
};

export default SearchBar;
