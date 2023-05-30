import { FunctionComponent } from 'react';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import { Series } from '../../types/series';
import { ArticleBasic } from '../../types/articles';
import Space from '@weco/common/views/components/styled/Space';
import SearchResults from '../SearchResults/SearchResults';

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
      <Layout8>
        <SearchResults
          key={series.id}
          title={title}
          summary={series.promo?.caption}
          items={items}
          showPosition={showPosition}
        />
        <Space v={{ size: 'm', properties: ['margin-top'] }}>
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
      </Layout8>
    </SpacingComponent>
  ) : null;
};
export default SeriesNavigation;
