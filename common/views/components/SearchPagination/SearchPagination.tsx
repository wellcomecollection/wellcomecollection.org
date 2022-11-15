import { useEffect, useState, FunctionComponent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { chevron } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon/Icon';
import { font } from '@weco/common/utils/classnames';

const Container = styled.nav.attrs({ className: font('intr', 5) })`
  display: flex;
  align-items: center;
`;

const ChevronWrapper = styled.a<{ prev?: boolean; darkBg?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 34px;
  width: 34px;
  border-radius: 100%;
  margin: 0 0 0 1rem;

  ${props => `
    color:  ${props.theme.color(props.darkBg ? 'white' : 'black')};
    border: 1px solid ${props.theme.color(
      props.darkBg ? 'neutral.400' : 'neutral.600'
    )};
    transform: rotate(${props.prev ? '90' : '270'}deg);
    ${props.prev && `margin: 0 1rem 0 0;`};
    transition: all ${props => props.theme.transitionProperties};


    &:hover, &:focus {
      background-color: ${props.theme.color(
        props.darkBg ? 'neutral.600' : 'neutral.300'
      )};
    }
  `}
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
    <Container aria-label="Search pagination">
      {showPrev && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage - 1 } }}
        >
          <ChevronWrapper darkBg={darkBg} prev>
            <Icon icon={chevron} />
            <span className="visually-hidden">
              {`Previous (page ${currentPage - 1})`}
            </span>
          </ChevronWrapper>
        </Link>
      )}

      <span id="searchInputLabel">
        {`Page ${currentPage} of ${totalPages}`}
      </span>

      {showNext && (
        <Link
          passHref
          href={{ pathname, query: { ...query, page: currentPage + 1 } }}
        >
          <ChevronWrapper darkBg={darkBg}>
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

export default SearchPagination;
