import { useRouter } from 'next/router';
import { RefObject, useEffect, useRef } from 'react';
import styled from 'styled-components';

import { classNames } from '@weco/common/utils/classnames';
import SearchForm from '@weco/common/views/components/SearchForm';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';

type OverlayProps = { $isActive: boolean };
const Overlay = styled.div.attrs<OverlayProps>(props => ({
  className: classNames({
    'is-hidden': !props.$isActive,
  }),
}))<OverlayProps>`
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0, 0.6);
  z-index: 9999;
`;

const SearchBarWrapper = styled(Space).attrs({
  $v: { size: 'xl', properties: ['padding-bottom'] },
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
  }, [router?.pathname, router?.query]);

  useEffect(() => {
    if (isActive) {
      inputRef?.current?.focus();
    }
  }, [isActive]);

  return (
    <Overlay $isActive={isActive}>
      <SearchBarWrapper
        ref={isActive ? wrapperRef : undefined}
        onClick={e => e.stopPropagation()}
      >
        <Container>
          <SearchForm inputRef={inputRef} />
        </Container>
      </SearchBarWrapper>
    </Overlay>
  );
};

export default HeaderSearch;
