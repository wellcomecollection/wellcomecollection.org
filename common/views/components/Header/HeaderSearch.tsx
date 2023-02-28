import { RefObject, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { classNames } from '@weco/common/utils/classnames';
import SearchBar from '@weco/common/views/components/SearchBar/SearchBar';
import Space from '@weco/common/views/components/styled/Space';
import { getQueryPropertyValue, linkResolver } from '@weco/common/utils/search';
import { formDataAsUrlQuery } from '@weco/common/utils/forms';

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
  handleCloseModal: () => void;
  searchButtonRef: RefObject<HTMLButtonElement>;
};

const HeaderSearch = ({
  isActive,
  handleCloseModal,
  searchButtonRef,
}: Props) => {
  const router = useRouter();
  const routerQuery = getQueryPropertyValue(router?.query?.query);
  const [inputValue, setInputValue] = useState(routerQuery || '');
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleEscapeKey(event: KeyboardEvent) {
      if (event.code === 'Escape') {
        handleCloseModal();
      }
    }

    function hideDropdownOnDocClick(event: MouseEvent) {
      if (wrapperRef.current) {
        if (
          !searchButtonRef.current?.contains(event.target as HTMLDivElement)
        ) {
          handleCloseModal();
        }
      }
    }

    document.addEventListener('click', hideDropdownOnDocClick);
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('click', hideDropdownOnDocClick);
    };
  }, []);

  useEffect(() => {
    handleCloseModal();
    setInputValue('');
  }, [router?.pathname, router?.query]);

  useEffect(() => {
    if (isActive) {
      inputRef?.current?.focus();
    }
  }, [isActive]);

  const updateUrl = (form: HTMLFormElement) => {
    const formValues = formDataAsUrlQuery(form);
    const link = linkResolver({ params: formValues, pathname: '/search' });

    return router.push(link.href, link.as);
  };

  return (
    <Overlay isActive={isActive}>
      <SearchBarWrapper
        ref={isActive ? wrapperRef : undefined}
        onClick={e => e.stopPropagation()}
      >
        <form
          className="container"
          id="global-search-form"
          onSubmit={event => {
            event.preventDefault();
            updateUrl(event.currentTarget);
          }}
        >
          <SearchBar
            inputValue={inputValue}
            setInputValue={setInputValue}
            form="global-search-form"
            placeholder="Search our stories, images and catalogue"
            inputRef={inputRef}
            location="header"
          />
        </form>
      </SearchBarWrapper>
    </Overlay>
  );
};

export default HeaderSearch;
