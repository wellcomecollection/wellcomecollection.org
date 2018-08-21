// @flow
import {classNames, cssGrid} from '../../../utils/classnames';
import ExhibitionPromo from '../ExhibitionPromo/ExhibitionPromo';
import type {MultiContent} from '../../../model/multi-content';

type Props = {|
  items: MultiContent[]
|}

const CardGrid = ({
  items
}: Props) => (
  <div className='css-grid__container'>
    <div className='css-grid'>
      {items.map(item => (
        <div key={item.id} className={classNames({
          [cssGrid({s: 12, m: 6, l: 4, xl: 4})]: true
        })}>
          {item.type === 'exhibitions' &&
            <ExhibitionPromo
              id={item.id}
              url={`/exhibitions/${item.id}`}
              title={item.title}
              description={item.promoText}
              format={item.format}
              image={item.promoImage}
              start={item.start}
              end={item.end}
              statusOverride={item.statusOverride} />
          }
        </div>
      ))}
    </div>
  </div>
);

export default CardGrid;
