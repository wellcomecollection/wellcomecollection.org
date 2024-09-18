import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { MultiContent } from '@weco/content/types/multi-content';
import { font, grid } from '@weco/common/utils/classnames';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import CompactCard from '@weco/content/components/CompactCard/CompactCard';
import EventCard from '@weco/content/components/EventCard/EventCard';
import Space from '@weco/common/views/components/styled/Space';
import ArticleCard from '@weco/content/components/ArticleCard/ArticleCard';
import { getCrop } from '@weco/common/model/image';
import { Card } from '@weco/content/types/card';
import PlainList from '@weco/common/views/components/styled/PlainList';
import linkResolver from '@weco/common/services/prismic/link-resolver';

const Result = styled.li`
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

export type Props = {
  title?: string;
  summary?: string;
  items: readonly (MultiContent | Card)[];
  showPosition?: boolean;
};

const SearchResults: FunctionComponent<Props> = ({
  items,
  title,
  summary,
  showPosition = false,
}) => (
  <>
    {title && (
      <Space
        $v={!summary ? { size: 'l', properties: ['margin-bottom'] } : undefined}
      >
        <div className="grid">
          <div className={grid({ s: 12 })}>
            <h2 className={font('wb', 3)}>{title}</h2>
          </div>
        </div>
      </Space>
    )}
    {summary && (
      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>{summary}</Space>
    )}
    {items.length > 0 && (
      <PlainList>
        {items.map((item, index) => (
          <Result key={item.id} data-testid="search-result">
            {item.type === 'card' && (
              <CompactCard
                url={item.link}
                title={item.title || ''}
                primaryLabels={[]}
                secondaryLabels={[]}
                description={item.description || ''}
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
              />
            )}
            {item.type === 'pages' && (
              <CompactCard
                url={linkResolver(item)}
                title={item.title || ''}
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
                url={linkResolver(item)}
                title={item.title}
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
                url={linkResolver(item)}
                title={item.title}
                primaryLabels={item.labels}
                secondaryLabels={[]}
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
                url={linkResolver(item)}
                title={item.title || ''}
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
            {item.type === 'events' && (
              <EventCard
                event={item}
                xOfY={{ x: index + 1, y: items.length }}
              />
            )}
            {item.type === 'exhibitions' && (
              <CompactCard
                url={linkResolver(item)}
                title={item.title}
                primaryLabels={item.labels}
                secondaryLabels={[]}
                description={item.promo?.caption}
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
          </Result>
        ))}
      </PlainList>
    )}
  </>
);

export default SearchResults;
