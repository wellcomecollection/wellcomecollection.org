import SearchResults from '@weco/common/views/components/SearchResults/SearchResults';
import MoreLink from '@weco/common/views/components/MoreLink/MoreLink';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import Layout8 from '@weco/common/views/components/Layout8/Layout8';
import { ArticleSeries } from '@weco/common/model/article-series';
import { Article } from '@weco/common/model/articles';
import { ArticleScheduleItem } from '@weco/common/model/article-schedule-items';
import Space from '@weco/common/views/components/styled/Space';

type Props = {
  series: ArticleSeries;
  items: readonly (Article | ArticleScheduleItem)[];
};

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
