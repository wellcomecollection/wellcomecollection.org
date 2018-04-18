// @flow
import {grid} from '../../../utils/classnames';
import BasicPromo from '../BasicPromo/BasicPromo';
import type {MultiContent} from '../../../model/multi-content';

type Props = {|
  items: MultiContent[]
|}

const ContentListItems = ({ items }: Props) => (
  <div className='grid'>
    {items.map(item => (
      item.type === 'info-pages' && <div className={grid({s: 6})} key={item.id}>
        <BasicPromo
          url={`/info/${item.id}`}
          title={item.title}
          description={item.promo && item.promo.caption}
          imageProps={item.promo && item.promo.image}
        />
      </div>
    ))}
  </div>
);

export default ContentListItems;
