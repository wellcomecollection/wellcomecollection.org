// @flow
import type {MultiContent} from '../../../model/multi-content';
import {Fragment} from 'react';
import {grid} from '../../../utils/classnames';

type Props = {|
  title: ?string,
  items: MultiContent[]
|}

const ContentList = ({ title, items }: Props) => {
  const itemIds = items.map(i => i.id);
  return (
    <Fragment>
      <div className='grid'>
        <div className={grid({s: 12})}>
          <h2>{title}</h2>
        </div>
      </div>

      <div
        data-component='ContentListItems'
        className='async-content component-list-placeholder'
        data-endpoint={`/async/content-list?query=ids:${itemIds.join(',')}`}
        data-prefix-endpoint={false}
        data-modifiers={[]}>
      </div>
    </Fragment>
  );
};

export default ContentList;
