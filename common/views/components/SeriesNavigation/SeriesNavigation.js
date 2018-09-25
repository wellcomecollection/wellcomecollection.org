// @flow
import {Fragment} from 'react';
import SearchResults from '../SearchResults/SearchResults';
import PrimaryLink from '../Links/PrimaryLink/PrimaryLink';
import type {EventSeries} from '../../../model/event-series';
import type {ArticleSeries} from '../../../model/article-series';
import type {Article} from '../../../model/articles';
import type {UiEvent} from '../../../model/events';

type Props = {|
  series: ArticleSeries | EventSeries,
  items: Article[] | UiEvent[]
|}

const SeriesNavigation = ({ series, items }: Props) => {
  const showPosition = !!(series.schedule && series.schedule.length > 0);
  return (
    <Fragment>
      <SearchResults
        key={series.id}
        title={`Read more from ${series.title}`}
        summary={series.promoText}
        items={items}
        showPosition={showPosition} />
      <PrimaryLink
        name={`More from ${series.title}`}
        url={`/${series.type === 'article-series' ? 'series' : 'event-series'}/${series.id}`}
      />
    </Fragment>
  );
};
export default SeriesNavigation;
