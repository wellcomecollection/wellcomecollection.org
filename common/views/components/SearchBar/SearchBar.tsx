import {
  Dispatch,
  FunctionComponent,
  RefObject,
  SetStateAction,
  useRef,
} from 'react';
import styled from 'styled-components';

import TextInput from '@weco/common/views/components/TextInput/TextInput';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { themeValues } from '@weco/common/views/themes/config';
import ClearSearch from '@weco/common/views/components/ClearSearch/ClearSearch';

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
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  form: string;
  inputRef?: RefObject<HTMLInputElement>;
};

const SearchBar: FunctionComponent<Props> = ({
  inputValue,
  setInputValue,
  placeholder,
  form,
  inputRef,
}) => {
  const defaultInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <SearchInputWrapper>
        <TextInput
          id="search-searchbar"
          label={placeholder}
          name="query"
          type="search"
          value={inputValue}
          setValue={setInputValue}
          ref={inputRef || defaultInputRef}
          form={form}
          big={true}
        />
        {inputValue && (
          <ClearSearch
            inputRef={inputRef || defaultInputRef}
            setValue={setInputValue}
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
