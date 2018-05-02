// @flow
import {grid, spacing} from '../../../utils/classnames';
import BasicPromo from '../BasicPromo/BasicPromo';
import type {MultiContent} from '../../../model/multi-content';

type Props = {|
  items: MultiContent[]
|}

const ContentListItems = ({ items }: Props) => (
  <div className='grid'>
    {items.map(item => (
      item.type === 'info-pages' &&
      <div className={[
        grid({s: 12, m: 12, l: 12, xl: 12}),
        spacing({s: 2}, {margin: ['bottom']})
      ].join(' ')} key={item.id}>
        <BasicPromo
          promoType='InfoPagePromo'
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
