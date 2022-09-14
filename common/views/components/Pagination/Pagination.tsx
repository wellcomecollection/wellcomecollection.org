import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';
import Rotator from '../styled/Rotator';
import { arrow } from '@weco/common/icons';

export type Props = {
  total: number;
  prevPage?: number;
  currentPage: number;
  pageCount: number;
  nextPage?: number;
  nextQueryString?: string;
  prevQueryString?: string;
  range?: {
    beginning: number;
    end: number;
  };
};

const Pagination: FunctionComponent<Props> = ({
  prevPage,
  currentPage,
  pageCount,
  nextPage,
  nextQueryString,
  prevQueryString,
}: Props) => (
  <div
    className={`pagination float-r flex-inline flex--v-center font-pewter ${font(
      'lr',
      6
    )}`}
  >
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

    <span>
      Page {currentPage} of {pageCount}
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
  </div>
);

export default Pagination;
export class PaginationFactory {
  static fromList(
    l: [],
    total: number,
    currentPage = 1,
    pageSize = 32,
    getParams = {}
  ): Props {
    const size = l.length;
    const pageCount = Math.ceil(total / pageSize);
    const prevPage =
      pageCount > 1 && currentPage !== 1 ? currentPage - 1 : undefined;
    const nextPage =
      pageCount > 1 && currentPage !== pageCount ? currentPage + 1 : undefined;
    const beginning = pageSize * currentPage - pageSize + 1;
    const range = {
      beginning,
      end: beginning + size - 1,
    };
    const nextQueryString = buildQueryString(nextPage, getParams);
    const prevQueryString = buildQueryString(prevPage, getParams);
    const pagination: Props = {
      total,
      range,
      pageCount,
      currentPage,
      nextPage,
      prevPage,
      nextQueryString,
      prevQueryString,
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
