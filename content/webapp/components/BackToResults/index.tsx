import NextLink from 'next/link';
import { FunctionComponent, useContext } from 'react';

import { font } from '@weco/common/utils/classnames';
import SearchContext from '@weco/common/views/components/SearchContext';

const BackToResults: FunctionComponent = () => {
  const { link } = useContext(SearchContext);
  const query = link.href?.query;

  if (!query) return null;

  return (
    <NextLink
      {...link}
      data-gtm-trigger="back_to_search_results"
      className={font('intr', 5)}
    >
      <span>Back to search results</span>
    </NextLink>
  );
};

export default BackToResults;
