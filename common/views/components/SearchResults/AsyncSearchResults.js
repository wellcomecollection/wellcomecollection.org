// @flow
import {Fragment} from 'react';
import {grid} from '../../../utils/classnames';

type Props = {|
  title: ?string,
  query: string,
  pageSize: number
|}

const AsyncSearchResults = ({
  title,
  query,
  pageSize
}: Props) => {
  return (
    <Fragment>
      <div className='grid'>
        <div className={grid({s: 12})}>
          <h2 className='h2'>{title}</h2>
        </div>
      </div>

      <div
        data-component='ContentListItems'
        className='async-content component-list-placeholder'
        data-endpoint={'/async/search?query=' + encodeURIComponent(query + ` pageSize:${pageSize}`)}
        data-prefix-endpoint={false}
        data-modifiers={[]}>
      </div>
    </Fragment>
  );
};

export default AsyncSearchResults;
