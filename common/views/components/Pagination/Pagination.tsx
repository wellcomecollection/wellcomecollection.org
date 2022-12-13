import { useEffect, useState, FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { chevron } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import { font } from '@weco/common/utils/classnames';

export type Props = {
  totalPages: number;
  ariaLabel: string;
  hasDarkBg?: boolean;
  isHiddenMobile?: boolean;
  isLoading?: boolean;
};

const Container = styled.nav.attrs({ className: font('intr', 6) })<{
  isHiddenMobile?: boolean;
}>`
  display: flex;
  align-items: center;

  // We're removing the top pagination on mobile to avoid the controls getting too crowded.
  ${props =>
    props.theme.media(
      'medium',
      'max-width'
    )(`
    ${props.isHiddenMobile && 'display: none;'}; 
  `)}
`;

const ChevronWrapper = styled.button<{ prev?: boolean; hasDarkBg?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 34px;
  border-radius: 100%;
  margin: 0 0 0 1rem;
  cursor: pointer;
  transition: background ${props => props.theme.transitionProperties};
  background-color: transparent;

  &[disabled] {
    pointer-events: none;
    color: ${props =>
      props.theme.color(props.hasDarkBg ? 'neutral.300' : 'neutral.500')};
    border-color: ${props =>
      props.theme.color(props.hasDarkBg ? 'neutral.300' : 'neutral.500')};
  }

  ${props => props.prev && `margin: 0 1rem 0 0;`}

  ${props => `
    color: ${props.theme.color(props.hasDarkBg ? 'white' : 'black')};
    border: 1px solid ${props.theme.color(
      props.hasDarkBg ? 'neutral.400' : 'neutral.600'
    )};
    transform: rotate(${props.prev ? '90' : '270'}deg);

    &:hover, &:focus {
      background-color: ${props.theme.color(
        props.hasDarkBg ? 'neutral.600' : 'neutral.300'
      )};
    }
  `}
`;

export const Pagination: FunctionComponent<Props> = ({
  totalPages,
  ariaLabel,
  hasDarkBg,
  isHiddenMobile,
  isLoading,
}) => {
  const { pathname, query } = useRouter();
  const [currentPage, setCurrentPage] = useState(Number(query.page) || 1);

  useEffect(() => {
    setCurrentPage(Number(query.page) || 1);
  }, [query.page]);

  const showPrev = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <Container
      {...(!isHiddenMobile && { 'data-test-id': 'pagination' })} // This ensures that we only target the version of component that is also visible on mobile
      aria-label={ariaLabel}
      isHiddenMobile={isHiddenMobile}
    >
      {showPrev && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage - 1 } }}
        >
          <ChevronWrapper hasDarkBg={hasDarkBg} prev disabled={isLoading}>
            <Icon icon={chevron} />
            <span className="visually-hidden">
              {`Previous (page ${currentPage - 1})`}
            </span>
          </ChevronWrapper>
        </Link>
      )}

      <span>
        Page <strong>{currentPage}</strong> of {totalPages}
      </span>

      {showNext && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage + 1 } }}
        >
          <ChevronWrapper hasDarkBg={hasDarkBg} disabled={isLoading}>
            <Icon icon={chevron} />
            <span className="visually-hidden">
              {`Next (page ${currentPage + 1})`}
            </span>
          </ChevronWrapper>
        </Link>
      )}
    </Container>
  );
};

export default Pagination;
