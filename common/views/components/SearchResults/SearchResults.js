// @flow
import { Fragment } from 'react';
import type { MultiContent } from '../../../model/multi-content';
import { grid } from '../../../utils/classnames';
import { formatDate } from '../../../utils/format-date';
import Image from '../Image/Image';
import CompactCard from '../CompactCard/CompactCard';
import EventCard from '../EventCard/EventCard';
import ArticleCard from '../ArticleCard/ArticleCard';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import VerticalSpace from '../styled/VerticalSpace';

type Props = {|
  title?: string,
  summary?: ?string,
  items: $ReadOnlyArray<MultiContent>,
  showPosition?: boolean,
|};

const SearchResults = ({
  items,
  title,
  summary,
  showPosition = false,
}: Props) => (
  <Fragment>
    {title && (
      <VerticalSpace
        v={!summary ? { size: 'l', properties: ['margin-bottom'] } : undefined}
      >
        <div className="grid">
          <div className={grid({ s: 12 })}>
            <h2 className="h2 no-margin">{title}</h2>
          </div>
        </div>
      </VerticalSpace>
    )}
    {summary && (
      <VerticalSpace
        v={!title ? { size: 'l', properties: ['margin-bottom'] } : undefined}
      >
        {summary}
      </VerticalSpace>
    )}

    {items.map((item, index) => (
      <div className={`border-top-width-1 border-color-pumice`} key={item.id}>
        {item.type === 'pages' && (
          <CompactCard
            url={`/pages/${item.id}`}
            title={item.title || ''}
            partNumber={null}
            color={null}
            labels={{ labels: [] }}
            description={item.promo && item.promo.caption}
            urlOverride={item.promo && item.promo.link}
            Image={
              item.image &&
              item.image.crops &&
              item.image.crops.square && <Image {...item.image.crops.square} />
            }
            DateInfo={null}
            StatusIndicator={null}
            xOfY={{ x: index + 1, y: items.length }}
          />
        )}
        {item.type === 'event-series' && (
          <CompactCard
            url={`/event-series/${item.id}`}
            title={item.title || ''}
            partNumber={null}
            color={null}
            labels={{ labels: item.labels }}
            description={item.promo && item.promo.caption}
            urlOverride={item.promo && item.promo.link}
            Image={
              item.image &&
              item.image.crops &&
              item.image.crops.square && <Image {...item.image.crops.square} />
            }
            DateInfo={null}
            StatusIndicator={null}
            xOfY={{ x: index + 1, y: items.length }}
          />
        )}
        {item.type === 'books' && (
          <CompactCard
            url={`/books/${item.id}`}
            title={item.title || ''}
            labels={{ labels: item.labels }}
            partNumber={null}
            color={null}
            description={item.promo && item.promo.caption}
            urlOverride={item.promo && item.promo.link}
            Image={
              item.image &&
              item.image.crops &&
              item.image.crops.square && <Image {...item.image.crops.square} />
            }
            DateInfo={null}
            StatusIndicator={null}
            xOfY={{ x: index + 1, y: items.length }}
          />
        )}
        {item.type === 'articles' && (
          <ArticleCard
            article={item}
            showPosition={showPosition}
            xOfY={{ x: index + 1, y: items.length }}
          />
        )}
        {item.type === 'article-schedule-items' && (
          <CompactCard
            url={null}
            title={item.title || ''}
            partNumber={item.partNumber}
            color={item.color}
            labels={{ labels: [{ url: null, text: 'Story' }] }}
            description={`Available ${formatDate(item.publishDate)}`}
            urlOverride={null}
            Image={<ImagePlaceholder color={item.color} />}
            DateInfo={null}
            StatusIndicator={null}
            xOfY={{ x: index + 1, y: items.length }}
          />
        )}
        {item.type === 'events' && (
          <EventCard event={item} xOfY={{ x: index + 1, y: items.length }} />
        )}
        {item.type === 'exhibitions' && (
          <CompactCard
            url={`/exhibitions/${item.id}`}
            title={item.title}
            partNumber={null}
            color={null}
            labels={{ labels: item.labels }}
            description={item.promoText}
            urlOverride={null}
            Image={
              item.image &&
              item.image.crops &&
              item.image.crops.square && <Image {...item.image.crops.square} />
            }
            DateInfo={null}
            StatusIndicator={null}
            xOfY={{ x: index + 1, y: items.length }}
          />
        )}
      </div>
    ))}
  </Fragment>
);

export default SearchResults;
