// @flow
import {Fragment} from 'react';
import {spacing, grid, classNames} from '../../../utils/classnames';
import {formatDate} from '../../../utils/format-date';
import Image from '../Image/Image';
import CompactCard from '../CompactCard/CompactCard';
import EventCard from '../EventCard/EventCard';
import ArticleCard from '../ArticleCard/ArticleCard';
import type {MultiContent} from '../../../model/multi-content';

type Props = {|
  title?: string,
  summary?: ?string,
  items: $ReadOnlyArray<MultiContent>,
  showPosition?: boolean
|}

const SearchResults = ({
  items,
  title,
  summary,
  showPosition = false
}: Props) => (
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
        ${spacing({s: 4}, {margin: ['top']})}
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
              partNumber={null}
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
              partNumber={null}
              labels={{labels: item.labels}}
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
              labels={{labels: item.labels}}
              partNumber={null}
              description={item.promo && item.promo.caption}
              urlOverride={item.promo && item.promo.link}
              Image={item.promo && item.promo.image && <Image {...item.promo.image} />}
              DateInfo={null}
              StatusIndicator={null}
            />
          }

          {item.type === 'articles' &&
            <ArticleCard article={item} showPosition={showPosition} />
          }

          {item.type === 'article-schedule-items' &&
            <CompactCard
              promoType='ArticlePromo'
              url={`/articles/${item.id}`}
              title={item.title || ''}
              partNumber={item.partNumber}
              labels={{labels: [{url: null, text: 'Story'}]}}
              description={`Available ${formatDate(item.publishDate)}`}
              urlOverride={null}
              Image={<Image
                contentUrl={'https://prismic-io.s3.amazonaws.com/wellcomecollection%2F7ca32858-e347-4282-acaf-c55572961736_transparent.gif'}
                width={16}
                height={9}
                alt={''}
                extraClasses={'bg-purple'}
              />}
              DateInfo={null}
              StatusIndicator={null}
            />
          }

          {item.type === 'events' &&
            <EventCard event={item} />
          }

          {item.type === 'installations' &&
            <CompactCard
              promoType='InstallationPromo'
              url={`/installations/${item.id}`}
              title={item.title}
              partNumber={null}
              labels={{labels: item.labels}}
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
