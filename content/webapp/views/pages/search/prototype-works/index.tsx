import { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { pluralize } from '@weco/common/utils/grammar';
import { Container } from '@weco/common/views/components/styled/Container';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Space from '@weco/common/views/components/styled/Space';
import { WellcomeResultList } from '@weco/content/services/wellcome';
import {
  toWorkBasic,
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { withSearchLayout } from '@weco/content/views/layouts/SearchPageLayout';

import PrototypeWorksSearchResults from './PrototypeWorksSearchResults';

// Dynamically import variants - use generate-imports.js to regenerate this list
const variantFiles: Record<string, Work[]> = {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'elser_surgery-knife': require('./variants/elser_surgery-knife.json'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'openai_surgery-knife': require('./variants/openai_surgery-knife.json'),
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  'prod_surgery-knife': require('./variants/prod_surgery-knife.json'),
};

// Convert imported data to results
const prototypeResults: Record<
  string,
  WellcomeResultList<WorkBasic, undefined>
> = Object.fromEntries(
  Object.entries(variantFiles).map(([key, works]) => [
    key,
    {
      type: 'ResultList',
      totalResults: works.length,
      totalPages: 1,
      results: (works as Work[]).map(toWorkBasic),
      pageSize: works.length,
      prevPage: null,
      nextPage: null,
      _requestUrl: 'prototype-data',
    },
  ])
);

// ============================================================================

const SortPaginationWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const PrototypeNotice = styled.div`
  background: #fff8dc;
  border: 2px solid #ffa500;
  padding: 16px;
  margin-bottom: 24px;
  border-radius: 4px;
  font-weight: bold;
  text-align: center;
`;

export type Props = {
  query?: { query?: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  apiToolbarLinks?: any[];
};

const WorksPrototypePage: NextPage<Props> = withSearchLayout(() => {
  const router = useRouter();

  // Get variant from URL query parameter (e.g., ?variant=elser_surgery-knife)
  const variantKey = router.query.variant as string;
  const works = prototypeResults[variantKey];

  if (!works || works.results.length === 0) {
    return (
      <Space $v={{ size: 'md', properties: ['padding-bottom'] }}>
        <Container>
          <PrototypeNotice>
            ⚠️ PROTOTYPE MODE: Variant "{variantKey}" not found.
            <br />
          </PrototypeNotice>
        </Container>
      </Space>
    );
  }

  return (
    <>
      <Space $v={{ size: 'md', properties: ['padding-bottom'] }}>
        <Container>
          <PrototypeNotice>
            {(() => {
              const [model, query] = variantKey.split('_');
              return (
                <>
                  🧪 PROTOTYPE MODE: Showing {works.totalResults} results
                  <br />
                  Model: <strong>{model}</strong> | Query:{' '}
                  <strong>{query?.replace(/-/g, ' ')}</strong>
                </>
              );
            })()}
          </PrototypeNotice>

          <Space
            $v={{
              size: 'md',
              properties: ['padding-top', 'padding-bottom'],
            }}
          >
            {/* Search form is part of the layout, so query shows in the search box */}
          </Space>

          <PaginationWrapper $verticalSpacing="md">
            <span role="status">{pluralize(works.totalResults, 'result')}</span>

            <SortPaginationWrapper>
              {/* Sorting and pagination removed for prototype */}
              <div style={{ color: '#666', fontStyle: 'italic' }}>
                Static results - sorting disabled
              </div>
            </SortPaginationWrapper>
          </PaginationWrapper>

          <main>
            <PrototypeWorksSearchResults works={works.results} />
          </main>

          <PaginationWrapper $verticalSpacing="md" $alignRight>
            {/* Pagination removed for prototype */}
          </PaginationWrapper>
        </Container>
      </Space>
    </>
  );
});

export default WorksPrototypePage;
