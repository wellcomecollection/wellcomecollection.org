import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { chevron } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { formatNumber } from '@weco/common/utils/grammar';
import Icon from '@weco/common/views/components/Icon';

export type Props = {
  totalPages: number;
  ariaLabel: string;
  hasDarkBg?: boolean;
  isHiddenMobile?: boolean;
};

const Container = styled.nav.attrs({
  className: `${font('intr', 6)} is-hidden-print`,
})<{ $isHiddenMobile?: boolean }>`
  display: flex;
  align-items: center;

  /* We're removing the top pagination on mobile to avoid the controls getting too crowded. */
  ${props =>
    props.theme.media(
      'medium',
      'max-width'
    )(`
    ${props.$isHiddenMobile && 'display: none;'};
  `)}
`;

const ChevronWrapper = styled.a<{ $prev?: boolean; $hasDarkBg?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 34px;
  border-radius: 100%;
  margin: 0 0 0 1rem;
  cursor: pointer;
  transition: background-color ${props => props.theme.transitionProperties};

  /* This is required to make the icon be the right size on iOS.  If this class
  has 'position: relative', then iOS will give it an incorrect height and
  it will appear super small.  Illegible! */
  .icon {
    position: absolute;
  }

  &[disabled] {
    pointer-events: none;
    color: ${props =>
      props.theme.color(props.$hasDarkBg ? 'neutral.300' : 'neutral.500')};
    border-color: ${props =>
      props.theme.color(props.$hasDarkBg ? 'neutral.300' : 'neutral.500')};
  }

  ${props => props.$prev && `margin: 0 1rem 0 0;`}

  ${props => `
    color: ${props.theme.color(props.$hasDarkBg ? 'white' : 'black')};
    border: 1px solid ${props.theme.color(
      props.$hasDarkBg ? 'neutral.400' : 'neutral.600'
    )};
    transform: rotate(${props.$prev ? '90' : '270'}deg);

    &:hover {
      background-color: ${props.theme.color(
        props.$hasDarkBg ? 'neutral.600' : 'neutral.300'
      )};
    }
  `}
`;

export const Pagination: FunctionComponent<Props> = ({
  totalPages,
  ariaLabel,
  hasDarkBg,
  isHiddenMobile,
}) => {
  const router = useRouter();
  const { query, pathname } = router;

  const pageNumber = query.page ? Number(query.page) : 1;
  const [currentPage, setCurrentPage] = useState(pageNumber);

  useEffect(() => {
    // Only push changes if the page number is a different one than on currently
    if (currentPage !== pageNumber) {
      setCurrentPage(pageNumber);

      // Remove page from query if it's the first page
      // Using router.replace won't add this URL change to the browser history
      if (pageNumber === 1) {
        const { page, ...rest } = query;
        router.replace(
          { pathname: router.pathname, query: { ...rest } },
          undefined,
          { shallow: true }
        );
      }
    }
  }, [query.page]);

  const showPrev = pageNumber > 1;
  const showNext = pageNumber < totalPages;

  return (
    <Container
      data-component="pagination"
      {...(!isHiddenMobile && { 'data-testid': 'pagination' })} // This ensures that we only target the version of component that is also visible on mobile
      aria-label={ariaLabel}
      $isHiddenMobile={isHiddenMobile}
    >
      {showPrev && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage - 1 } }}
          legacyBehavior
        >
          <ChevronWrapper $hasDarkBg={hasDarkBg} $prev>
            <Icon icon={chevron} />
            <span className="visually-hidden">
              {`Previous (page ${currentPage - 1})`}
            </span>
          </ChevronWrapper>
        </Link>
      )}

      <span>
        Page <strong data-testid="current-page">{currentPage}</strong> of{' '}
        {formatNumber(totalPages)}
      </span>

      {showNext && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage + 1 } }}
          legacyBehavior
        >
          <ChevronWrapper $hasDarkBg={hasDarkBg}>
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
