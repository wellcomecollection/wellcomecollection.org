// @flow
import { Fragment } from 'react';
import SearchResults from '../SearchResults/SearchResults';
import MoreLink from '../MoreLink/MoreLink';
import type { EventSeries } from '../../../model/event-series';
import type { ArticleSeries } from '../../../model/article-series';
import type { Article } from '../../../model/articles';
import type { ArticleScheduleItem } from '../../../model/article-schedule-items';
import type { UiEvent } from '../../../model/events';
import Space from '../styled/Space';

type Props = {|
  series: ArticleSeries | EventSeries,
  items: $ReadOnlyArray<Article | UiEvent | ArticleScheduleItem>,
|};

const SeriesNavigation = ({ series, items }: Props) => {
  const showPosition = !!(series.schedule && series.schedule.length > 0);
  return (
    <Fragment>
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
    </Fragment>
  );
};
export default SeriesNavigation;
