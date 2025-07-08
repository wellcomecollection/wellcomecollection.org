import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { getCrop } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { font } from '@weco/common/utils/classnames';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { Card } from '@weco/content/types/card';
import { MultiContent } from '@weco/content/types/multi-content';
import ArticleCard from '@weco/content/views/components/ArticleCard';
import CompactCard from '@weco/content/views/components/CompactCard';

import EventCard from './SearchResults.EventCard';

const Result = styled.li`
  border-top: 1px solid ${props => props.theme.color('warmNeutral.400')};
`;

export type Props = {
  id?: string;
  title?: string;
  summary?: string;
  items: readonly (MultiContent | Card)[];
  showPosition?: boolean;
};

const SearchResults: FunctionComponent<Props> = ({
  id,
  items,
  title,
  summary,
  showPosition = false,
}) => (
  <>
    {title && (
      <Space
        $v={!summary ? { size: 'm', properties: ['margin-bottom'] } : undefined}
      >
        <h2 id={id} className={font('wb', 3)}>
          {title}
        </h2>
      </Space>
    )}
    {summary && (
      <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>{summary}</Space>
    )}
    {items.length > 0 && (
      <PlainList>
        {items.map((item, index) => {
          if (item.type === 'weblinks') return null;

          const itemImage =
            'image' in item
              ? item.image
              : 'cover' in item
                ? item.cover
                : undefined;

          const xOfY = { x: index + 1, y: items.length };

          const BaseCompactCard = ({
            primaryLabels = [],
            secondaryLabels = [],
            description = '',
            urlOverride,
            ...rest
          }: {
            primaryLabels?: Label[];
            secondaryLabels?: Label[];
            description?: string;
            urlOverride?: string;
          }) => (
            <CompactCard
              url={'link' in item ? item.link : linkResolver(item)}
              title={item.title || ''}
              primaryLabels={primaryLabels}
              secondaryLabels={secondaryLabels}
              description={description}
              xOfY={xOfY}
              Image={
                getCrop(itemImage, 'square') && (
                  <PrismicImage
                    image={{
                      // We intentionally omit the alt text on promos, so screen reader
                      // users don't have to listen to the alt text before hearing the
                      // title of the item in the list.
                      //
                      // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
                      ...getCrop(itemImage, 'square')!,
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
              {...rest}
            />
          );

          return (
            <Result key={item.id} data-testid="search-result">
              {item.type === 'card' && (
                <BaseCompactCard description={item.description} />
              )}
              {item.type === 'pages' && (
                <BaseCompactCard
                  description={item.promo?.caption || item.metadataDescription}
                  urlOverride={item.promo && item.promo.link}
                />
              )}
              {(item.type === 'books' ||
                item.type === 'event-series' ||
                item.type === 'series') && (
                <BaseCompactCard
                  primaryLabels={item.labels}
                  description={item.promo && item.promo.caption}
                  urlOverride={item.promo && item.promo.link}
                />
              )}
              {item.type === 'exhibitions' && (
                <BaseCompactCard
                  primaryLabels={item.labels}
                  description={item.promo?.caption}
                />
              )}
              {item.type === 'articles' && (
                <ArticleCard
                  article={item}
                  showPosition={showPosition}
                  xOfY={xOfY}
                />
              )}
              {item.type === 'events' && <EventCard event={item} xOfY={xOfY} />}
            </Result>
          );
        })}
      </PlainList>
    )}
  </>
);

export default SearchResults;
