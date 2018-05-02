// @flow
import type {MultiContent} from '../../../model/multi-content';
import {Fragment} from 'react';
import {grid} from '../../../utils/classnames';

type Props = {|
  title: ?string,
  items: MultiContent[],
  requiredCount?: number,
  backfillQuery: ?string
|}

const ContentList = ({
  title,
  items,
  requiredCount = 0,
  backfillQuery
}: Props) => {
  const itemIds = items.map(i => i.id);
  const backfillCount = requiredCount - items.length;

  const query = [
    itemIds.length > 0 ? `ids:${itemIds.join(',')}` : null,
    backfillQuery  || '',
    backfillCount > 0 ? `count:${backfillCount}` : null
  ].filter(Boolean).join(' ');

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
        data-endpoint={'/async/content-list?query=' + encodeURIComponent(query)}
        data-prefix-endpoint={false}
        data-modifiers={[]}>
      </div>
    </Fragment>
  );
};

export default ContentList;
