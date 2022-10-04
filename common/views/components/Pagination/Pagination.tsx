import { FunctionComponent } from 'react';
import { font } from '../../../utils/classnames';
import Control from '../Buttons/Control/Control';
import Space from '../styled/Space';
import Rotator from '../styled/Rotator';
import { arrow } from '@weco/common/icons';
import styled from 'styled-components';
import { PaginatedResults } from 'services/prismic/types';

export type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  paginatedResults: PaginatedResults<any>;
  paginationRoot: string;
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
  paginatedResults,
  paginationRoot,
}: Props) => {
  const { currentPage, totalPages } = paginatedResults;

  const prevPage = currentPage > 1 ? currentPage - 1 : undefined;
  const nextPage = currentPage < totalPages ? currentPage + 1 : undefined;

  return (
    <PaginatorContainer>
      <PaginatorWrapper aria-label="pagination">
        {prevPage && (
          <Space as="span" h={{ size: 'm', properties: ['margin-right'] }}>
            <Rotator rotate={180}>
              <Control
                link={{
                  // TODO: Fix the type checking here
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore: Works but should be of LinkProps Type
                  href: `${paginationRoot}?page=${prevPage}`,
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore: Works but should be of LinkProps Type
                  as: `${paginationRoot}?page=${prevPage}`,
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

        {nextPage && (
          <Space as="span" h={{ size: 'm', properties: ['margin-left'] }}>
            <Control
              link={{
                // TODO: Fix the type checking here
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Works but should be of LinkProps Type
                href: `${paginationRoot}?page=${nextPage}`,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore: Works but should be of LinkProps Type
                as: `${paginationRoot}?page=${nextPage}`,
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
