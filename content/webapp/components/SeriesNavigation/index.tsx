import { FunctionComponent } from 'react';

import {
  ContaineredLayout,
  gridSize8,
} from '@weco/common/views/components/Layout';
import Space from '@weco/common/views/components/styled/Space';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import MoreLink from '@weco/content/components/MoreLink';
import SearchResults from '@weco/content/components/SearchResults';
import { ArticleBasic } from '@weco/content/types/articles';
import { Series } from '@weco/content/types/series';

type Props = {
  series: Series;
  items: ArticleBasic[];
  isPodcast: boolean;
};

const SeriesNavigation: FunctionComponent<Props> = ({
  series,
  items,
  isPodcast,
}) => {
  const showPosition = !!(series.schedule && series.schedule.length > 0);
  const title = isPodcast
    ? `Listen to more from ${series.title}`
    : `Read more from ${series.title}`;
  return items.length > 0 ? (
    <SpacingComponent>
      <ContaineredLayout gridSizes={gridSize8()}>
        <SearchResults
          key={series.id}
          title={title}
          summary={series.promo?.caption}
          items={items}
          showPosition={showPosition}
        />
        <Space $v={{ size: 'm', properties: ['margin-top'] }}>
          <MoreLink
            name={`More from ${series.title}`}
            url={{
              href: {
                pathname: '/series/[seriesId]',
                query: { seriesId: series.id },
              },
            }}
          />
        </Space>
      </ContaineredLayout>
    </SpacingComponent>
  ) : null;
};
export default SeriesNavigation;
