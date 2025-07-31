import { FunctionComponent } from 'react';

import AsyncSearchResults, {
  Props as AsyncSearchResultsProps,
} from './SearchResults.Async';
import SearchResultsDefault, {
  Props as SearchResultsDefaultProps,
} from './SearchResults.Default';

type Props =
  | (SearchResultsDefaultProps & { variant: 'default' })
  | (AsyncSearchResultsProps & { variant: 'async' });

const SearchResults: FunctionComponent<Props> = props => {
  const { variant } = props;

  return (
    <div data-component="search-results">
      {variant === 'default' ? (
        <SearchResultsDefault {...props} />
      ) : (
        <AsyncSearchResults {...props} />
      )}
    </div>
  );
};

export default SearchResults;
