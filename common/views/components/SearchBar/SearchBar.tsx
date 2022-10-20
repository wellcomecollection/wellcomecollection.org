import { FC, useState, useRef } from 'react';
import styled from 'styled-components';

import TextInputV2 from '@weco/common/views/components/TextInput/TextInputV2';
import ButtonSolidV2 from '@weco/common/views/components/ButtonSolid/ButtonSolidV2';
import { themeValues } from '@weco/common/views/themes/config';

import { formDataAsUrlQuery } from '@weco/common/utils/forms';

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

// TODO wrap in form with filters?
const SearchBar: FC = () => {
  const [inputQuery, setInputQuery] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const searchForm = useRef<HTMLFormElement>(null);

  // TODO
  const updateUrl = (form: HTMLFormElement) => {
    const urlQuery = formDataAsUrlQuery(form);
  };

  return (
    <form
      role="search"
      ref={searchForm}
      // action={isImageSearch ? '/images' : '/works'}
      // aria-describedby={ariaDescribedBy}
      onSubmit={event => {
        event.preventDefault();

        // trackEvent({
        //   category: 'SearchForm',
        //   action: 'submit search',
        //   label: query,
        // });

        updateUrl(event.currentTarget);
        return false;
      }}
    >
      <Container>
        <SearchInputWrapper>
          <TextInputV2
            id="dummy-searchbar"
            label="Search {type}"
            name="query"
            type="search"
            value={inputQuery}
            setValue={setInputQuery}
            ref={searchInput}
            big={true}
            placeholder=""
            ariaLabel="Search {type}"
          />
        </SearchInputWrapper>
        <SearchButtonWrapper>
          <ButtonSolidV2
            text="Search"
            size="large"
            colors={themeValues.buttonColors.yellowYellowBlack}
          />
        </SearchButtonWrapper>
      </Container>
    </form>
  );
};

export default SearchBar;
