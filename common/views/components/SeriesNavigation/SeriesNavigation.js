// @flow
import SearchResults from '../SearchResults/SearchResults';
// $FlowFixMe
import MoreLink from '../MoreLink/MoreLink';
import SpacingComponent from '../SpacingComponent/SpacingComponent';
// $FlowFixMe
import Layout8 from '../Layout8/Layout8';
import type { EventSeries } from '../../../model/event-series';
import type { ArticleSeries } from '../../../model/article-series';
import type { Article } from '../../../model/articles';
import type { ArticleScheduleItem } from '../../../model/article-schedule-items';
import type { UiEvent } from '../../../model/events';
// $FlowFixMe (tsx)
import Space from '../styled/Space';

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
