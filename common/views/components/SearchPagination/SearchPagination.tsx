import { chevron } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, FunctionComponent } from 'react';
import styled from 'styled-components';

const PageSelectorInput = styled.input<{ darkBg?: boolean }>`
  height: 36px;
  width: 36px;
  max-width: 50px;
  background: none;
  color: ${({ darkBg }) => (darkBg ? '#ffffff' : '#121212')};
  border: ${({ darkBg }) => (darkBg ? '#cccccc' : '#6b6b6b')} 1px solid;
  border-radius: 5px;
  text-align: center;
  margin: 0 10px;
`;

const ChevronWrapper = styled.a<{ prev?: boolean; darkBg?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  width: 36px;
  border: 1px solid ${({ darkBg }) => (darkBg ? '#d9d9d9' : '#6b6b6b')};
  border-radius: 50px;
  transform: rotate(${({ prev }) => (prev ? '90' : '270')}deg);
  margin: 0 8px;
`;

export const SearchPagination: FunctionComponent<{
  totalPages: number;
  darkBg?: boolean;
}> = ({ totalPages, darkBg }) => {
  const { pathname, query } = useRouter();
  const [currentPage, setCurrentPage] = useState(Number(query.page) || 1);

  useEffect(() => {
    setCurrentPage(Number(query.page) || 1);
  }, [query.page]);

  const showPrev = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <nav
      aria-label="search pagination"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      <span aria-hidden>Showing page</span>
      <span id="searchInputLabel" className="visually-hidden">
        {`Showing page ${currentPage} / ${totalPages}`}
      </span>
      <PageSelectorInput
        name="page"
        form="searchPageForm"
        aria-labelledby="searchInputLabel"
        value={currentPage}
        onChange={e => setCurrentPage(Number(e.target.value))}
        darkBg={darkBg}
      />
      <span aria-hidden>/ {totalPages}</span>
      {showPrev && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage - 1 } }}
        >
          <ChevronWrapper darkBg={darkBg} prev>
            <Icon icon={chevron} color={darkBg ? 'white' : 'black'} />
            <span className="visually-hidden">previous page</span>
          </ChevronWrapper>
        </Link>
      )}
      {showNext && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage + 1 } }}
        >
          <ChevronWrapper darkBg={darkBg}>
            <Icon icon={chevron} color={darkBg ? 'white' : 'black'} />
            <span className="visually-hidden">next page</span>
          </ChevronWrapper>
        </Link>
      )}
    </nav>
  );
};

export default SearchPagination;
