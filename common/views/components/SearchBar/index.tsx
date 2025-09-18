import { FunctionComponent } from 'react';

import SearchBarDefault, {
  Props as SearchBarDefaultProps,
} from './SearchBar.Default';
import SearchBarNew, { Props as SearchBarNewProps } from './SearchBar.New';

type Props =
  | (SearchBarDefaultProps & { variant: 'default' })
  | (SearchBarNewProps & { variant: 'new' });

const SearchBar: FunctionComponent<Props> = props => {
  const { variant, ...restProps } = props;

  return (
    <div data-component="search-bar">
      {variant === 'new' ? (
        <SearchBarNew {...restProps} />
      ) : (
        <SearchBarDefault {...restProps} />
      )}
    </div>
  );
};

export default SearchBar;
export type { ValidLocations } from './SearchBar.Default';
