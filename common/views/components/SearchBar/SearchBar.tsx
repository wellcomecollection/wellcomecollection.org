import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';

import TextInputV2 from '@weco/common/views/components/TextInput/TextInputV2';
import ButtonSolidV2 from '@weco/common/views/components/ButtonSolid/ButtonSolidV2';
import { themeValues } from '@weco/common/views/themes/config';

import { useRouter } from 'next/router';
import ClearSearch from '../ClearSearch/ClearSearch';

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

const SearchBar: FunctionComponent<{ type: string }> = ({ type }) => {
  const { query } = useRouter();
  const [inputQuery, setInputQuery] = useState((query.query as string) || '');

  return (
    <Container>
      <SearchInputWrapper>
        <TextInputV2
          id="dummy-searchbar"
          label={`Search ${type}`}
          name="query"
          type="search"
          value={inputQuery}
          setValue={setInputQuery}
          form="searchPageForm"
          big={true}
          placeholder="search..."
          ariaLabel={`Search ${type}`}
        />
      </SearchInputWrapper>
      <SearchButtonWrapper>
        <ButtonSolidV2
          text="Search"
          size="large"
          form="searchPageForm"
          colors={themeValues.buttonColors.yellowYellowBlack}
        />
      </SearchButtonWrapper>
    </Container>
  );
};

export default SearchBar;
