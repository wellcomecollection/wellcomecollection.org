import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';
import Rotator from '../styled/Rotator';
import { arrow } from '@weco/common/icons';
import styled from 'styled-components';

export type Props = {
  totalResults: number;
  currentPage: number;
  totalPages: number;
  prevPage?: number;
  nextPage?: number;
  prevQueryString?: string;
  nextQueryString?: string;
  range?: {
    beginning: number;
    end: number;
  };
};

const PaginatorContainer = styled(Space).attrs({
  className: font('intr', 5),
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
    overrides: { small: 5, medium: 5, large: 1 },
  },
})`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const PaginatorWrapper = styled.nav`
  display: flex;
  align-items: center;
`;

const Pagination: FunctionComponent<Props> = ({
  currentPage,
  totalPages,
  prevPage,
  nextPage,
  prevQueryString,
  nextQueryString,
}: Props) => {
  return (
    <PaginatorContainer>
      <PaginatorWrapper aria-label="pagination">
        {prevPage && prevQueryString && (
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <Rotator rotate={180}>
              <Control
                link={{
                  // TODO: Fix the type checking here
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore: Works but should be of LinkProps Type
                  href: prevQueryString,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore: Works but should be of LinkProps Type
                  as: prevQueryString,
                }}
                colorScheme="light"
                icon={arrow}
                text={`Previous (page ${prevPage})`}
              />
            </Rotator>
          </Space>
        )}

        <span className="font-neutral-600">
          Page {currentPage} of {totalPages}
        </span>

        {nextPage && nextQueryString && (
          <Space as="span" h={{ size: 'm', properties: ['margin-left'] }}>
            <Control
              link={{
                // TODO: Fix the type checking here
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Works but should be of LinkProps Type
                href: nextQueryString,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Works but should be of LinkProps Type
                as: nextQueryString,
              }}
              colorScheme="light"
              icon={arrow}
              text={`Next (page ${nextPage})`}
            />
          </Space>
        )}
      </PaginatorWrapper>
    </PaginatorContainer>
  );
};

export default Pagination;
export class PaginationFactory {
  static fromList(
    l: [],
    totalResults: number,
    currentPage = 1,
    pageSize = 32,
    getParams = {}
  ): Props {
    const size = l.length;
    const totalPages = Math.ceil(totalResults / pageSize);
    const prevPage =
      totalPages > 1 && currentPage !== 1 ? currentPage - 1 : undefined;
    const nextPage =
      totalPages > 1 && currentPage !== totalPages
        ? currentPage + 1
        : undefined;
    const beginning = pageSize * currentPage - pageSize + 1;
    const range = {
      beginning,
      end: beginning + size - 1,
    };
    const nextQueryString = buildQueryString(nextPage, getParams);
    const prevQueryString = buildQueryString(prevPage, getParams);
    const pagination: Props = {
      totalResults,
      currentPage,
      totalPages,
      prevPage,
      nextPage,
      prevQueryString,
      nextQueryString,
      range,
    };
    return pagination;
  }
}

function buildQueryString(
  page: number | undefined,
  getParams: Record<string, string> = {}
): string {
  const paramsArray = Object.keys(getParams)
    .map(key => {
      if (key !== 'page') {
        return `${key}=${encodeURIComponent(getParams[key])}`;
      }
    })
    .filter(_ => _);

  const paramsString = paramsArray.join('&');

  if (paramsArray.length && page) {
    return `?${paramsString}&page=${page}`;
  } else if (page) {
    return `?page=${page}`;
  } else if (paramsArray.length) {
    return `?${paramsString}`;
  } else {
    return '';
  }
}
