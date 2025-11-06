import {
  Dispatch,
  FunctionComponent,
  RefObject,
  SetStateAction,
  useRef,
} from 'react';
import styled, { useTheme } from 'styled-components';

import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import TextInput from '@weco/common/views/components/TextInput';

const Container = styled.div`
  display: flex;
  align-items: flex-end;
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

export type Props = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  form: string;
  inputRef?: RefObject<HTMLInputElement | null>;
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
  const theme = useTheme();
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
          hasClearButton
        />
      </SearchInputWrapper>
      <SearchButtonWrapper>
        <Button
          variant="ButtonSolid"
          text="Search"
          type={ButtonTypes.submit}
          form={form}
          colors={theme.buttonColors.greenGreenWhite}
        />
      </SearchButtonWrapper>
    </Container>
  );
};

export default SearchBar;
