// @flow
import {Fragment} from 'react';
import {spacing, grid, classNames} from '../../../utils/classnames';
import Image from '../Image/Image';
import CompactCard from '../CompactCard/CompactCard';
import EventCard from '../EventCard/EventCard';
import ArticleCard from '../ArticleCard/ArticleCard';
import type {MultiContent} from '../../../model/multi-content';

type Props = {|
  title?: string,
  summary?: ?string,
  items: $ReadOnlyArray<MultiContent>
|}

const SearchResults = ({ items, title, summary }: Props) => (
  <Fragment>
    {title && <div className='grid'>
      <div className={grid({s: 12})}>
        <h2 className='h2'>{title}</h2>
      </div>
    </div>}
    {summary &&
      <div className={classNames({
        [spacing({s: 1}, {margin: ['bottom']})]: true
      })}>
        {summary}
      </div>
    }
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
              labels={{labels: []}}
              description={item.promo && item.promo.caption}
              urlOverride={item.promo && item.promo.link}
              Image={item.promo && item.promo.image && <Image {...item.promo.image} />}
              DateInfo={null}
              StatusIndicator={null}
            />
          }

          {item.type === 'event-series' &&
            <CompactCard
              promoType='EventSeriesPromo'
              url={`/event-series/${item.id}`}
              title={item.title || ''}
              labels={{labels: [{url: null, text: 'Event series'}]}}
              description={item.promo && item.promo.caption}
              urlOverride={item.promo && item.promo.link}
              Image={item.promo && item.promo.image && <Image {...item.promo.image} />}
              DateInfo={null}
              StatusIndicator={null}
            />
          }

          {item.type === 'books' &&
            <CompactCard
              promoType='BooksPromo'
              url={`/books/${item.id}`}
              title={item.title || ''}
              labels={{labels: [{url: null, text: 'Book'}]}}
              description={item.promo && item.promo.caption}
              urlOverride={item.promo && item.promo.link}
              Image={item.promo && item.promo.image && <Image {...item.promo.image} />}
              DateInfo={null}
              StatusIndicator={null}
            />
          }

          {item.type === 'articles' &&
            <ArticleCard article={item} />
          }

          {item.type === 'events' &&
            <EventCard event={item} />
          }

          {item.type === 'installations' &&
            <CompactCard
              promoType='InstallationPromo'
              url={`/installations/${item.id}`}
              title={item.title || ''}
              labels={{labels: [{url: null, text: 'Installation'}]}}
              description={item.promoText}
              urlOverride={item.promo && item.promo.link}
              Image={item.promo && item.promo.image && <Image {...item.promo.image} />}
              DateInfo={null}
              StatusIndicator={null}
            />
          }
        </div>
      ))}
    </div>
  </Fragment>
);

export default SearchResults;
