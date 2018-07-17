// @flow
import {Fragment} from 'react';
import {spacing, grid} from '../../../utils/classnames';
import BasicPromo from '../BasicPromo/BasicPromo';
import type {MultiContent} from '../../../model/multi-content';

type Props = {|
  title?: string,
  items: $ReadOnlyArray<MultiContent>
|}

const SearchResults = ({ items, title }: Props) => (
  <Fragment>
    {title && <div className='grid'>
      <div className={grid({s: 12})}>
        <h2 className='h2'>{title}</h2>
      </div>
    </div>}
    <div className={`
        ${spacing({s: 11}, {margin: ['top']})}
      `}>
      {items.map(item => (
        <div className={
          spacing({s: 5}, {padding: ['bottom', 'top']}) +
          ` border-top-width-1 border-color-pumice`
        } key={item.id}>
          {item.type === 'pages' &&
            <BasicPromo
              promoType='PagePromo'
              url={`/pages/${item.id}`}
              title={item.title || ''}
              description={item.promo && item.promo.caption}
              imageProps={item.promo && item.promo.image}
              link={item.promo && item.promo.link}
            />
          }

          {item.type === 'event-series' &&
            <BasicPromo
              promoType='EventSeriesPromo'
              url={`/event-series/${item.id}`}
              title={item.title || ''}
              description={item.promo && item.promo.caption}
              imageProps={item.promo && item.promo.image}
              link={item.promo && item.promo.link}
            />
          }

          {item.type === 'books' &&
            <BasicPromo
              promoType='BooksPromo'
              url={`/books/${item.id}`}
              title={item.title || ''}
              description={item.promo && item.promo.caption}
              imageProps={item.promo && item.promo.image}
              link={item.promo && item.promo.link}
            />
          }

          {item.type === 'events' &&
            <BasicPromo
              promoType='EventPromo'
              url={`/events/${item.id}`}
              title={item.title || ''}
              description={item.promo && item.promo.caption}
              imageProps={item.promo && item.promo.image}
              link={item.promo && item.promo.link}
            />
          }
        </div>
      ))}
    </div>
  </Fragment>
);

export default SearchResults;
