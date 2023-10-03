import { FunctionComponent, useContext } from 'react';
import NextLink from 'next/link';
import { font } from '@weco/common/utils/classnames';
import { trackGaEvent } from '@weco/common/utils/ga';
import SearchContext from '@weco/common/views/components/SearchContext/SearchContext';

const BackToResults: FunctionComponent = () => {
  const { link } = useContext(SearchContext);
  const query = link.href?.query;
  const queryString = link.href?.query?.query;
  const page = link.href?.query?.page;

  if (!query) return null;

  return (
    <NextLink
      {...link}
      data-gtm-trigger="back_to_search_results"
      onClick={() => {
        trackGaEvent({
          category: 'BackToResults',
          action: 'follow link',
          label: `${queryString || ''} | page: ${page || 1}`,
        });
      }}
      className={font('intr', 5)}
    >
      <span>Back to search results</span>
    </NextLink>
  );
};

export default BackToResults;
