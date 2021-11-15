// @flow
import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
// $FlowFixMe
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
// $FlowFixMe
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
// $FlowFixMe
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import type { EventSeries } from '@weco/common/model/event-series';
import type { ArticleSeries } from '@weco/common/model/article-series';
import type { Article } from '@weco/common/model/articles';
import type { ArticleScheduleItem } from '@weco/common/model/article-schedule-items';
import type { UiEvent } from '@weco/common/model/events';
// $FlowFixMe (tsx)
import Space from '@weco/common/views/components/styled/Space';

type Props = {|
  series: ArticleSeries | EventSeries,
  items: $ReadOnlyArray<Article | UiEvent | ArticleScheduleItem>,
|};

const SeriesNavigation = ({ series, items }: Props) => {
  const showPosition = !!(series.schedule && series.schedule.length > 0);
  return (
    <SpacingComponent>
      <Layout8>
        <SearchResults
          key={series.id}
          title={`Read more from ${series.title}`}
          summary={series.promoText}
          items={items}
          showPosition={showPosition}
        />
        <Space v={{ size: 'm', properties: ['margin-top'] }}>
          <MoreLink
            name={`More from ${series.title}`}
            url={`/${series.type}/${series.id}`}
          />
        </Space>
      </Layout8>
    </SpacingComponent>
  );
};
export default SeriesNavigation;
