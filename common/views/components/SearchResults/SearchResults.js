// @flow
import { Fragment } from 'react';
import type { MultiContent } from '../../../model/multi-content';
// $FlowFixMe (ts)
import { grid } from '../../../utils/classnames';
import { formatDate } from '../../../utils/format-date';
import Image from '../Image/Image';
// $FlowFixMe(tsx)
import CompactCard from '../CompactCard/CompactCard';
import EventCard from '../EventCard/EventCard';
// $FlowFixMe(tsx)
import ArticleCard from '../ArticleCard/ArticleCard';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
// $FlowFixMe (tsx)
import Space from '../styled/Space';
import styled from 'styled-components';

const Result = styled.div`
  border-top: 1px solid ${props => props.theme.color('pumice')};
`;

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
      <Space
        v={!summary ? { size: 'l', properties: ['margin-bottom'] } : undefined}
      >
        <div className="grid">
          <div className={grid({ s: 12 })}>
            <h2 className="h2">{title}</h2>
          </div>
        </div>
      </Space>
    )}
    {summary && (
      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>{summary}</Space>
    )}

    {items.map((item, index) => (
      <Result key={item.id}>
        {item.type === 'pages' && (
          <CompactCard
            url={`/pages/${item.id}`}
            title={item.title || ''}
            partNumber={null}
            color={null}
            primaryLabels={[]}
            secondaryLabels={[]}
            description={item.promo && item.promo.caption}
            urlOverride={item.promo && item.promo.link}
            Image={
              item.image &&
              item.image.crops &&
              item.image.crops.square && (
                <Image {...item.image.crops.square} alt="" />
              )
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
            primaryLabels={item.labels}
            secondaryLabels={[]}
            description={item.promo && item.promo.caption}
            urlOverride={item.promo && item.promo.link}
            Image={
              item.image &&
              item.image.crops &&
              item.image.crops.square && (
                <Image {...item.image.crops.square} alt="" />
              )
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
            primaryLabels={item.labels}
            secondaryLabels={[]}
            partNumber={null}
            color={null}
            description={item.promo && item.promo.caption}
            urlOverride={item.promo && item.promo.link}
            Image={
              item.image &&
              item.image.crops &&
              item.image.crops.square && (
                <Image {...item.image.crops.square} alt="" />
              )
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
            primaryLabels={{ labels: [{ text: 'Story' }] }}
            secondaryLabels={[]}
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
            primaryLabels={item.labels}
            secondaryLabels={[]}
            description={item.promoText}
            urlOverride={null}
            Image={
              item.image &&
              item.image.crops &&
              item.image.crops.square && (
                <Image {...item.image.crops.square} alt="" />
              )
            }
            DateInfo={null}
            StatusIndicator={null}
            xOfY={{ x: index + 1, y: items.length }}
          />
        )}
      </Result>
    ))}
  </Fragment>
);

export default SearchResults;
