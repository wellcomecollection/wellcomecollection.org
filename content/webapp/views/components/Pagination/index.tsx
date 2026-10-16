import Link from 'next/link';
import { useRouter } from 'next/router';
import { FunctionComponent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { chevron } from '@weco/common/icons';
import { typography } from '@weco/common/utils/classnames';
import { formatNumber } from '@weco/common/utils/grammar';
import Icon from '@weco/common/views/components/Icon';
import { designSystemColor } from '@weco/common/views/themes/config';

export type Props = {
  totalPages: number;
  ariaLabel: string;
  isOnDark?: boolean;
  isHiddenMobile?: boolean;
};

const Container = styled.nav.attrs({
  className: `${typography('body', 'sm', 'regular')} is-hidden-print`,
})<{ $isHiddenMobile?: boolean }>`
  display: flex;
  align-items: center;

  /* We're removing the top pagination on mobile to avoid the controls getting too crowded. */
  ${props =>
    props.theme.media(
      'sm',
      'max-width'
    )(`
    ${props.$isHiddenMobile ? 'display: none;' : ''}
  `)}
`;

const ChevronWrapper = styled(Link)<{
  $isPrev?: boolean;
  $isOnDark?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  width: 44px;
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
      props.theme.color(props.$isOnDark ? 'neutral.300' : 'neutral.500')};
    border-color: ${props =>
      props.theme.color(props.$isOnDark ? 'neutral.300' : 'neutral.500')};
  }

  ${props => props.$isPrev && `margin: 0 1rem 0 0;`}

  ${props => `
    color: ${props.theme.color(props.$isOnDark ? 'white' : 'black')};
    border: 1px solid ${props.theme.color(
      props.$isOnDark
        ? 'neutral.400'
        : { brand: 'neutral.70', legacy: 'neutral.600' }
    )};
    transform: rotate(${props.$isPrev ? '90' : '270'}deg);

    &:hover {
      background-color: ${props.theme.color(
        props.$isOnDark ? 'neutral.600' : 'neutral.300'
      )};
    }
  `}

  /* The brand outlines it, then fills it and thickens the ring on hover */
  ${props => {
    if (!props.theme.brandUpdate) return '';
    const ink = designSystemColor(
      props.$isOnDark ? 'neutral.10' : 'neutral.70'
    );
    const paper = designSystemColor(
      props.$isOnDark ? 'neutral.70' : 'neutral.10'
    );

    // Swap instantly, as fading inverted colours makes the chevron flicker out
    return `
      box-sizing: border-box;
      color: ${ink};
      border: 1px solid ${ink};
      transition: none;

      .icon,
      .icon__shape {
        transition: none;
      }

      &:hover {
        background-color: ${ink};
        border: 2px solid ${paper};
        color: ${paper};
      }

      &[disabled] {
        background-color: ${designSystemColor('ui.grey.40')};
        border-color: ${designSystemColor('ui.grey.60')};
        color: ${designSystemColor('ui.grey.60')};
      }
    `;
  }}
`;

export const Pagination: FunctionComponent<Props> = ({
  totalPages,
  ariaLabel,
  isOnDark,
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
        <ChevronWrapper
          href={{ pathname, query: { ...query, page: currentPage - 1 } }}
          $isOnDark={isOnDark}
          $isPrev
        >
          <Icon icon={chevron} />
          <span className="visually-hidden">
            {`Previous (page ${currentPage - 1})`}
          </span>
        </ChevronWrapper>
      )}

      <span>
        Page <strong data-testid="current-page">{currentPage}</strong> of{' '}
        {formatNumber(totalPages)}
      </span>

      {showNext && (
        <ChevronWrapper
          href={{ pathname, query: { ...query, page: currentPage + 1 } }}
          $isOnDark={isOnDark}
        >
          <Icon icon={chevron} />
          <span className="visually-hidden">
            {`Next (page ${currentPage + 1})`}
          </span>
        </ChevronWrapper>
      )}
    </Container>
  );
};

export default Pagination;
