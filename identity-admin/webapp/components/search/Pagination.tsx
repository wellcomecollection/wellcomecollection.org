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
