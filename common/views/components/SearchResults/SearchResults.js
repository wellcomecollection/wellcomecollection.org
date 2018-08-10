// @flow
import {Fragment} from 'react';
import {spacing, grid} from '../../../utils/classnames';
import Image from '../Image/Image';
import CompactCard from '../CompactCard/CompactCard';
import EventCard from '../EventCard/EventCard';
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
          `border-top-width-1 border-color-pumice`
        } key={item.id}>
          {item.type === 'pages' &&
            <CompactCard
              promoType='PagePromo'
              url={`/pages/${item.id}`}
              title={item.title || ''}
              description={item.promo && item.promo.caption}
              Image={item.promo && item.promo.image && <Image {...item.promo.image} />}
              urlOverride={item.promo && item.promo.link}
              Tags={null}
              DateInfo={null}
            />
          }

          {item.type === 'event-series' &&
            <CompactCard
              promoType='EventSeriesPromo'
              url={`/event-series/${item.id}`}
              title={item.title || ''}
              description={item.promo && item.promo.caption}
              Image={item.promo && item.promo.image && <Image {...item.promo.image} />}
              urlOverride={item.promo && item.promo.link}
              Tags={null}
              DateInfo={null}
            />
          }

          {item.type === 'books' &&
            <CompactCard
              promoType='BooksPromo'
              url={`/books/${item.id}`}
              title={item.title || ''}
              description={item.promo && item.promo.caption}
              Image={item.promo && item.promo.image && <Image {...item.promo.image} />}
              urlOverride={item.promo && item.promo.link}
              Tags={null}
              DateInfo={null}
            />
          }

          {item.type === 'events' &&
            <EventCard event={item} />
          }
        </div>
      ))}
    </div>
  </Fragment>
);

export default SearchResults;
