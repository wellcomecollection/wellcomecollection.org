import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { classNames } from '@weco/common/utils/classnames';
import SearchBar from '@weco/common/views/components/SearchBar/SearchBar';
import Space from '@weco/common/views/components/styled/Space';
import { getQueryPropertyValue } from '@weco/common/utils/search';

const Overlay = styled.div.attrs<{ isActive: boolean }>(props => ({
  className: classNames({
    'is-hidden': !props.isActive,
  }),
}))<{ isActive: boolean }>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9999;
`;

const SearchBarWrapper = styled(Space).attrs({
  v: { size: 'xl', properties: ['padding-bottom'] },
})`
  position: absolute;
  width: 100%;
  ${props => props.theme.makeSpacePropertyValues('l', ['padding-top'])};
  background-color: ${props => props.theme.color('white')};
`;

type Props = {
  isActive: boolean;
  setIsActive: Dispatch<SetStateAction<boolean>>;
};

const HeaderSearch = ({ isActive, setIsActive }: Props) => {
  const router = useRouter();
  const routerQuery = getQueryPropertyValue(router?.query?.query);
  const [inputValue, setInputValue] = useState(routerQuery || '');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsActive(false);
    setInputValue('');
  }, [router?.pathname, router?.query]);

  useEffect(() => {
    if (isActive) {
      inputRef?.current?.focus();
    }
  }, [isActive]);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        setIsActive(false);
      }
    }

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, []);

  return (
    <Overlay
      isActive={isActive}
      onClick={() => {
        setIsActive(false);
      }}
    >
      <SearchBarWrapper onClick={e => e.stopPropagation()}>
        <form
          className="container"
          id="global-search-form"
          onSubmit={event => {
            event.preventDefault();
            const headerInputValue = inputRef?.current?.value;
            // TODO if released before the redirect is in placeholder, link to /works instead
            router.push(
              `/search${headerInputValue ? `?query=${headerInputValue}` : ''}`
            );
          }}
        >
          <SearchBar
            inputValue={inputValue}
            setInputValue={setInputValue}
            form="global-search-form"
            placeholder="Search Wellcome Collection"
            inputRef={inputRef}
          />
        </form>
      </SearchBarWrapper>
    </Overlay>
  );
};

export default HeaderSearch;
