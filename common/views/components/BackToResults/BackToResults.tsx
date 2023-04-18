import { FunctionComponent, useContext } from 'react';
import NextLink from 'next/link';
import { font } from '../../../utils/classnames';
import { trackGaEvent } from '../../../utils/ga';
import SearchContext from '../SearchContext/SearchContext';

const BackToResults: FunctionComponent = () => {
  const { link } = useContext(SearchContext);
  const query = link.href?.query?.query;
  const page = link.href?.query?.page;

  return query ? (
    <NextLink
      {...link}
      data-gtm-trigger="back_to_search_results"
      onClick={() => {
        trackGaEvent({
          category: 'BackToResults',
          action: 'follow link',
          label: `${query} | page: ${page || 1}`,
        });
      }}
      className={font('intr', 5)}
    >
      <span>{`Back to search${query ? ' results' : ''}`}</span>
    </NextLink>
  ) : null;
};

export default BackToResults;
