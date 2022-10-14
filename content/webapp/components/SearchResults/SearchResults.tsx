import { Fragment, FunctionComponent } from 'react';
import styled from 'styled-components';
import { MultiContent } from '../../types/multi-content';
import { grid } from '@weco/common/utils/classnames';
import { formatDate } from '@weco/common/utils/format-date';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import CompactCard from '../CompactCard/CompactCard';
import EventCard from '../EventCard/EventCard';
import ImagePlaceholder from '../ImagePlaceholder/ImagePlaceholder';
import Space from '@weco/common/views/components/styled/Space';
import ArticleCard from '../ArticleCard/ArticleCard';
import { ArticleScheduleItem } from '../../types/article-schedule-items';
import { getCrop } from '@weco/common/model/image';
import { Card } from '../../types/card';

const Result = styled.div`
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

export type Props = {
  title?: string;
  summary?: string;
  items: readonly (MultiContent | ArticleScheduleItem | Card)[];
  showPosition?: boolean;
};

const SearchResults: FunctionComponent<Props> = ({
  items,
  title,
  summary,
  showPosition = false,
}) => (
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

    {items.map(
      (item, index) =>
        item.type !== 'card' && (
          <Result key={item.id}>
            {item.type === 'pages' && (
              <CompactCard
                url={`/pages/${item.id}`}
                title={item.title || ''}
                partNumber={undefined}
                color={undefined}
                primaryLabels={[]}
                secondaryLabels={[]}
                description={item.promo?.caption || item.metadataDescription}
                urlOverride={item.promo && item.promo.link}
                Image={
                  getCrop(item.image, 'square') && (
                    <PrismicImage
                      image={{
                        // We intentionally omit the alt text on promos, so screen reader
                        // users don't have to listen to the alt text before hearing the
                        // title of the item in the list.
                        //
                        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                        ...getCrop(item.image, 'square')!,
                        alt: '',
                      }}
                      sizes={{
                        xlarge: 1 / 6,
                        large: 1 / 6,
                        medium: 1 / 5,
                        small: 1 / 4,
                      }}
                      quality="low"
                    />
                  )
                }
                xOfY={{ x: index + 1, y: items.length }}
              />
            )}
            {item.type === 'event-series' && (
              <CompactCard
                url={`/event-series/${item.id}`}
                title={item.title || ''}
                partNumber={undefined}
                color={undefined}
                primaryLabels={item.labels}
                secondaryLabels={[]}
                description={item.promo && item.promo.caption}
                urlOverride={item.promo && item.promo.link}
                Image={
                  getCrop(item.image, 'square') && (
                    <PrismicImage
                      image={{
                        // We intentionally omit the alt text on promos, so screen reader
                        // users don't have to listen to the alt text before hearing the
                        // title of the item in the list.
                        //
                        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                        ...getCrop(item.image, 'square')!,
                        alt: '',
                      }}
                      sizes={{
                        xlarge: 1 / 6,
                        large: 1 / 6,
                        medium: 1 / 5,
                        small: 1 / 4,
                      }}
                      quality="low"
                    />
                  )
                }
                xOfY={{ x: index + 1, y: items.length }}
              />
            )}
            {item.type === 'books' && (
              <CompactCard
                url={`/books/${item.id}`}
                title={item.title || ''}
                primaryLabels={item.labels}
                secondaryLabels={[]}
                partNumber={undefined}
                color={undefined}
                description={item.promo && item.promo.caption}
                urlOverride={item.promo && item.promo.link}
                Image={
                  getCrop(item.cover, 'square') && (
                    <PrismicImage
                      image={{
                        // We intentionally omit the alt text on promos, so screen reader
                        // users don't have to listen to the alt text before hearing the
                        // title of the item in the list.
                        //
                        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                        ...getCrop(item.cover, 'square')!,
                        alt: '',
                      }}
                      sizes={{
                        xlarge: 1 / 6,
                        large: 1 / 6,
                        medium: 1 / 5,
                        small: 1 / 4,
                      }}
                      quality="low"
                    />
                  )
                }
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
            {item.type === 'series' && (
              <CompactCard
                url={`/series/${item.id}`}
                title={item.title || ''}
                partNumber={undefined}
                color={undefined}
                primaryLabels={item.labels}
                secondaryLabels={[]}
                description={item.promo && item.promo.caption}
                urlOverride={item.promo && item.promo.link}
                Image={
                  getCrop(item.image, 'square') && (
                    <PrismicImage
                      image={{
                        // We intentionally omit the alt text on promos, so screen reader
                        // users don't have to listen to the alt text before hearing the
                        // title of the item in the list.
                        //
                        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                        ...getCrop(item.image, 'square')!,
                        alt: '',
                      }}
                      sizes={{
                        xlarge: 1 / 6,
                        large: 1 / 6,
                        medium: 1 / 5,
                        small: 1 / 4,
                      }}
                      quality="low"
                    />
                  )
                }
                xOfY={{ x: index + 1, y: items.length }}
              />
            )}
            {item.type === 'article-schedule-items' && (
              <CompactCard
                title={item.title || ''}
                partNumber={item.partNumber}
                color={item.color}
                primaryLabels={
                  /* We don't show a label on items that haven't been published yet, because
                   * we don't know whether they're a story, comic, etc.
                   * See https://github.com/wellcomecollection/wellcomecollection.org/pull/7568 */
                  []
                }
                secondaryLabels={[]}
                description={`Available ${formatDate(item.publishDate)}`}
                Image={<ImagePlaceholder color={item.color} />}
                xOfY={{ x: index + 1, y: items.length }}
              />
            )}
            {item.type === 'events' && (
              <EventCard
                event={item}
                xOfY={{ x: index + 1, y: items.length }}
              />
            )}
            {item.type === 'exhibitions' && (
              <CompactCard
                url={`/exhibitions/${item.id}`}
                title={item.title}
                partNumber={undefined}
                color={undefined}
                primaryLabels={item.labels}
                secondaryLabels={[]}
                description={item.promo?.caption}
                Image={
                  getCrop(item.promo?.image, 'square') && (
                    <PrismicImage
                      image={{
                        // We intentionally omit the alt text on promos, so screen reader
                        // users don't have to listen to the alt text before hearing the
                        // title of the item in the list.
                        //
                        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                        ...getCrop(item.promo?.image, 'square')!,
                        alt: '',
                      }}
                      sizes={{
                        xlarge: 1 / 6,
                        large: 1 / 6,
                        medium: 1 / 5,
                        small: 1 / 4,
                      }}
                      quality="low"
                    />
                  )
                }
                xOfY={{ x: index + 1, y: items.length }}
              />
            )}
          </Result>
        )
    )}
  </Fragment>
);

export default SearchResults;
