// @flow
import type {InfoPage} from '../../../model/info-pages';
import {Fragment} from 'react';
import {grid} from '../../../utils/classnames';
import BasicPromo from '../BasicPromo/BasicPromo';

type Props = {|
  title: ?string,
  items: (| InfoPage)[]
|}

const ContentList = ({ title, items }: Props) => {
  return (
    <Fragment>
      <div className='grid'>
        <div className={grid({s: 12})}>
          <h2>{title}</h2>
        </div>
        {items.map(item => {
          if (item.type === 'info-pages') {
            return (
              <div className={grid({s: 12})}>
                <BasicPromo
                  promoType='InfoPagePromo'
                  url={`/info/${item.id}`}
                  title={item.title}
                  description={null}
                />
              </div>);
          }
        })}
      </div>
    </Fragment>
  );
};

export default ContentList;
