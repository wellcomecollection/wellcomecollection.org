import NextLink from 'next/link';
import { FunctionComponent } from 'react';

import { useSearchContext } from '@weco/common/contexts/SearchContext';
import { font } from '@weco/common/utils/classnames';

const BackToResults: FunctionComponent = () => {
  const { link } = useSearchContext();
  const query = link.href?.query;

  if (!query) return null;

  return (
    <NextLink
      {...link}
      data-gtm-trigger="back_to_search_results"
      className={font('intr', -1)}
    >
      <span>Back to search results</span>
    </NextLink>
  );
};

export default BackToResults;
