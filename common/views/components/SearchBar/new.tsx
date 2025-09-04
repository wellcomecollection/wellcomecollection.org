import {
  Dispatch,
  FunctionComponent,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';
import styled from 'styled-components';
import Typed from 'typed.js';

import { search } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Button, { ButtonTypes } from '@weco/common/views/components/Buttons';
import { Grid, GridCell } from '@weco/common/views/components/styled/Grid';
import TextInput from '@weco/common/views/components/TextInput';
import { themeValues } from '@weco/common/views/themes/config';
import { visuallyHiddenStyles } from '@weco/common/views/themes/utility-classes';

const Container = styled.div`
  display: flex;
  align-items: flex-end;
`;

const Typewriter = styled.div.attrs({
  className: font('intr', 2),
  'aria-hidden': 'true',
})`
  position: absolute;
  pointer-events: none;
  top: calc(50% + 14px);
  transform: translateY(-50%);
  left: 20px;
  z-index: 1;
  color: ${props => props.theme.color('neutral.500')};
  width: calc(100% - 32px);
  overflow: hidden;
  text-wrap: nowrap;
  text-overflow: ellipsis;
`;

const SearchInputWrapper = styled.div`
  flex: 1 1 auto;

  position: relative;
  font-size: 20px;

  input {
    border: none;
    height: 55px;

    ${props => props.theme.media('medium')`
      height: 65px;
    `}
  }

  .search-query {
    height: ${props => 10 * props.theme.spacingUnit}px;
  }

  &:has(input:not(:placeholder-shown)),
  &:focus-within {
    ${Typewriter} {
      display: none;
    }
  }
`;

const SearchButtonWrapper = styled.div`
  button {
    height: 63px;

    ${props => props.theme.media('medium')`
      height: 73px;
    `}

    span:not(:first-child) {
      ${props =>
        props.theme.mediaBetween(
          'small',
          'medium'
        )(`
        ${visuallyHiddenStyles};
      `)}
    }

    &:focus {
      position: relative;
      z-index: 1;
    }

    &:focus-visible {
      border-color: transparent;
    }
  }
`;

type Props = {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  placeholder: string;
  form: string;
  inputRef?: RefObject<HTMLInputElement | null>;
  location: ValidLocations;
  showTypewriter?: boolean;
};

export type ValidLocations = 'header' | 'search' | 'page';

const SearchBar: FunctionComponent<Props> = ({
  inputValue,
  setInputValue,
  placeholder,
  form,
  inputRef,
  location,
  showTypewriter,
}) => {
  const defaultInputRef = useRef<HTMLInputElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typewriterRef.current) {
      const typed = new Typed(typewriterRef.current, {
        strings: [
          'Florence Nightingale letters',
          'Cookery and medical recipe book',
          'Medical officer of health 1938',
          'Magic',
          'David Beales archives',
          'Chinese medicine',
          'India',
          'Manuscripts',
          'Oil paintings',
          'Vaccines',
          'Easter',
        ]
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value),
        typeSpeed: 100,
        backSpeed: 25,
        backDelay: 2000,
        loop: true,
        showCursor: false,
      });

      return () => {
        typed.destroy();
      };
    }
  }, [typewriterRef.current]);

  return (
    <Grid>
      <GridCell $sizeMap={{ s: [12], m: [10], l: [10], xl: [10] }}>
        <Container data-component="search-bar" className="is-hidden-print">
          <SearchInputWrapper>
            {showTypewriter && <Typewriter ref={typewriterRef} />}
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
              isNewSearchBar={true}
              placeholder=" " // This empty placeholder is required for the :placeholder-shown CSS selector to work
            />
          </SearchInputWrapper>
          <SearchButtonWrapper>
            <Button
              variant="ButtonSolid"
              text="Search"
              type={ButtonTypes.submit}
              form={form}
              colors={themeValues.buttonColors.greenGreenWhite}
              icon={search}
            />
          </SearchButtonWrapper>
        </Container>
      </GridCell>
    </Grid>
  );
};

export default SearchBar;
