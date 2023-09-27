import {
  Dispatch,
  FunctionComponent,
  RefObject,
  SetStateAction,
  useContext,
  useRef,
} from 'react';
import styled from 'styled-components';

import TextInput from '@weco/common/views/components/TextInput/TextInput';
import ButtonSolid, {
  ButtonTypes,
} from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { themeValues } from '@weco/common/views/themes/config';

import ClearSearch from '@weco/content/components/ClearSearch/ClearSearch';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

const Container = styled.div`
  display: flex;
  align-items: stretch;
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
  button {
    height: 100%;
  }
`;

type Props = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  form: string;
  inputRef?: RefObject<HTMLInputElement>;
  location: ValidLocations;
};

export type ValidLocations = 'header' | 'search' | 'page';

const SearchBar: FunctionComponent<Props> = ({
  inputValue,
  setInputValue,
  placeholder,
  form,
  inputRef,
  location,
}) => {
  const { isEnhanced } = useContext(AppContext);
  const defaultInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container className="is-hidden-print">
      <SearchInputWrapper>
        <TextInput
          id={`${location}-searchbar`}
          label={placeholder}
          name="query"
          type="search"
          value={inputValue}
          setValue={setInputValue}
          ref={inputRef || defaultInputRef}
          form={form}
          big={true}
        />
        {inputValue && isEnhanced && (
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
          form={form}
          colors={themeValues.buttonColors.yellowYellowBlack}
        />
      </SearchButtonWrapper>
    </Container>
  );
};

export default SearchBar;
