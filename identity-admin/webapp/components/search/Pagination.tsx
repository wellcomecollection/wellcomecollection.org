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

const Pagination = ({ currentPage, pageCount }: Props): JSX.Element => {
  const router = useRouter();
  const { status, name, email, sort, sortDir } = router.query;

  const pageUrl = (page: number): string => {
    return buildSearchUrl(String(page), status, name, email, sort, sortDir);
  };

  return (
    <div className="user-pagination">
      {currentPage > 1 ? (
        <a href={pageUrl(currentPage - 1)} className={firstLinkClassName}>
          Previous
        </a>
      ) : (
        <span className={firstLinkClassName + ' ' + disabled}>Previous</span>
      )}
      {currentPage > 3 && (
        <a href={pageUrl(1)} className={linkClassName}>
          1
        </a>
      )}
      {currentPage > 4 && <span className={ellipses}>...</span>}
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
      {currentPage + 3 < pageCount && <span className={ellipses}>...</span>}
      {currentPage + 2 < pageCount && (
        <a href={pageUrl(pageCount)} className={linkClassName}>
          {pageCount}
        </a>
      )}
      {currentPage < pageCount ? (
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
