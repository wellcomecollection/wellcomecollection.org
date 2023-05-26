import { useEffect, useState, FunctionComponent, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { chevron } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import { formatNumber } from '@weco/common/utils/grammar';
import {
  ChevronWrapper,
  Container,
  PageSelectorInput,
} from './Pagination.styles';

export type Props = {
  totalPages: number;
  ariaLabel: string;
  hasDarkBg?: boolean;
  isHiddenMobile?: boolean;
  isLoading?: boolean;
};

export const Pagination: FunctionComponent<Props> = ({
  totalPages,
  ariaLabel,
  hasDarkBg,
  isHiddenMobile,
  isLoading,
}) => {
  const router = useRouter();
  const { query, pathname } = router;

  const pageNumber = query.page ? Number(query.page) : 1;
  const [currentPage, setCurrentPage] = useState(pageNumber);
  const [isFocused, setIsFocused] = useState(false);
  const { isEnhanced } = useContext(AppContext);

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
      {...(!isHiddenMobile && { 'data-testid': 'pagination' })} // This ensures that we only target the version of component that is also visible on mobile
      aria-label={ariaLabel}
      isHiddenMobile={isHiddenMobile}
    >
      {showPrev && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage - 1 } }}
          legacyBehavior
        >
          <ChevronWrapper hasDarkBg={hasDarkBg} prev disabled={isLoading}>
            <Icon icon={chevron} />
            <span className="visually-hidden">
              {`Previous (page ${currentPage - 1})`}
            </span>
          </ChevronWrapper>
        </Link>
      )}

      {isEnhanced ? (
        <>
          <span aria-hidden>Showing page</span>
          <PageSelectorInput
            name="page"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            form={isFocused ? 'search-page-form' : ''}
            aria-label={`Showing page ${currentPage} / ${formatNumber(
              totalPages
            )}`}
            value={currentPage}
            onChange={e => setCurrentPage(Number(e.target.value))}
            darkBg={hasDarkBg}
          />
          <span aria-hidden>/ {formatNumber(totalPages)}</span>
        </>
      ) : (
        <span>
          Page <strong>{currentPage}</strong> of {formatNumber(totalPages)}
        </span>
      )}

      {showNext && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage + 1 } }}
          legacyBehavior
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
