import { useRouter } from 'next/router';
import { buildSearchUrl } from '../../utils/search-util';

type Props = {
  currentPage: number;
  pageCount: number;
};

const firstLinkClassName = 'user-pagination__item user-pagination__item--first';
const linkClassName = 'user-pagination__item';
const lastLinkClassName = 'user-pagination__item user-pagination__item--last';
const disabled = 'user-pagination__item--disabled';
const ellipses = 'user-pagination__item user-pagination__item--ellipses';
const maxPageLinks = 4;

const Pagination = ({ currentPage, pageCount }: Props): JSX.Element => {
  const router = useRouter();
  const { status, name, email, sort, sortDir } = router.query;

  const pageUrl = (page: number): string => {
    return buildSearchUrl(String(page), status, name, email, sort, sortDir);
  };

  const hasPrevious: boolean = currentPage > 1;
  const hasNext: boolean = currentPage < pageCount;
  const hasFirstPageLink: boolean = currentPage >= maxPageLinks;
  const hasLastPageLink: boolean = currentPage < pageCount - maxPageLinks / 2;
  const hasPrefixEllipses: boolean = currentPage > maxPageLinks;
  const hasSuffixEllipses: boolean = currentPage <= pageCount - maxPageLinks;

  return (
    <div className="user-pagination">
      {hasPrevious ? (
        <a href={pageUrl(currentPage - 1)} className={firstLinkClassName}>
          Previous
        </a>
      ) : (
        <span className={firstLinkClassName + ' ' + disabled}>Previous</span>
      )}
      {hasFirstPageLink && (
        <a href={pageUrl(1)} className={linkClassName}>
          1
        </a>
      )}
      {hasPrefixEllipses && <span className={ellipses}>...</span>}
      {currentPage > 2 && (
        <a href={pageUrl(currentPage - 2)} className={linkClassName}>
          {currentPage - 2}
        </a>
      )}
      {currentPage > 1 && (
        <a href={pageUrl(currentPage - 1)} className={linkClassName}>
          {currentPage - 1}
        </a>
      )}
      <span className={linkClassName + ' ' + disabled}>{currentPage}</span>
      {currentPage < pageCount && (
        <a href={pageUrl(currentPage + 1)} className={linkClassName}>
          {currentPage + 1}
        </a>
      )}
      {currentPage + 1 < pageCount && (
        <a href={pageUrl(currentPage + 2)} className={linkClassName}>
          {currentPage + 2}
        </a>
      )}
      {hasSuffixEllipses && <span className={ellipses}>...</span>}
      {hasLastPageLink && (
        <a href={pageUrl(pageCount)} className={linkClassName}>
          {pageCount}
        </a>
      )}
      {hasNext ? (
        <a href={pageUrl(currentPage + 1)} className={lastLinkClassName}>
          Next
        </a>
      ) : (
        <span className={lastLinkClassName + ' ' + disabled}>Next</span>
      )}
    </div>
  );
};

export default Pagination;
