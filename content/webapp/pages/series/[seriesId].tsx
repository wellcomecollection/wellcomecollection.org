import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import * as prismic from '@prismicio/client';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import { Series } from '@weco/content/types/series';
import { ArticleBasic } from '@weco/content/types/articles';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { GaDimensions } from '@weco/common/services/app/google-analytics';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { createClient } from '@weco/content/services/prismic/fetch';
import { bodySquabblesSeries } from '@weco/common/data/hardcoded-ids';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import {
  getScheduledItems,
  sortSeriesItems,
} from '@weco/content/services/prismic/transformers/article-series';
import { getPage } from '@weco/content/utils/query-params';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import Pagination from '@weco/content/components/Pagination/Pagination';
import { seasonsFetchLinks } from '@weco/content/services/prismic/types';
import { Pageview } from '@weco/common/services/conversion/track';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { ArticleScheduleItem } from '@weco/content/types/article-schedule-items';
import styled from 'styled-components';
import ArticleCard from '@weco/content/components/ArticleCard/ArticleCard';
import ArticleScheduleItemCard from '@weco/content/components/ArticleScheduleItemCard';
import { setCacheControl } from '@weco/content/utils/setCacheControl';

const SeriesItem = styled.div<{ $isFirst: boolean }>`
  border-top: ${props =>
    `${props.$isFirst ? '0' : '1px'} solid ${props.theme.color(
      'warmNeutral.400'
    )}`};
`;

type Props = {
  series: Series;
  articles: PaginatedResults<ArticleBasic>;
  scheduledItems: ArticleScheduleItem[];
  gaDimensions: GaDimensions;
  pageview: Pageview;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);

  const { seriesId } = context.query;

  if (!looksLikePrismicId(seriesId)) {
    return { notFound: true };
  }

  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const client = createClient(context);

  // GOTCHA: This is for a series where we have the `webcomics` type.
  // This will have to remain like this until we figure out how to migrate them.
  // We create new webcomics as an article with comic format, and add
  // an article-series to them.
  const seriesField =
    seriesId === bodySquabblesSeries
      ? 'my.webcomics.series.series'
      : 'my.articles.series.series';

  const articlesQuery = await fetchArticles(client, {
    filters: [prismic.filter.at(seriesField, seriesId)],
    page,
    pageSize: 20,
    fetchLinks: seasonsFetchLinks,
  });

  // This can occasionally occur if somebody in the Editorial team is
  // trying to preview a series that doesn't have any entries yet.
  //
  // It should never happen for live content so we don't support it;
  // the log is to make it easier to debug if somebody tries it.
  if (articlesQuery.total_results_size === 0) {
    console.warn(`Series ${seriesId} doesn't contain any articles`);
    return { notFound: true };
  }

  // We've seen people trying to request a high-numbered page for a series,
  // presumably by guessing at URLs, e.g. /series/W-XBJxEAAKmng1TG?page=500.
  //
  // We need a non-empty list of articles to get any metadata about the series,
  // so if this page doesn't have any articles, let's 404 here.
  //
  // Note: this is a debug rather than a warn because it's more likely to be
  // somebody guessing about our URL scheme than somebody in Editorial looking
  // at a yet-to-be-published series.
  //
  // Note: we may be able to remove this once we refactor transformArticleSeries,
  // see https://github.com/wellcomecollection/wellcomecollection.org/issues/8516
  if (articlesQuery.results_size === 0) {
    console.debug(
      `Series ${seriesId} doesn't have any articles on page ${page}`
    );
    return { notFound: true };
  }

  const articles = transformQuery(articlesQuery, transformArticle);

  // We know that `articles` is non-empty, and because we queried for articles in
  // this series, we know these articles have a series defined.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const series = articles.results[0].series.find(
    series => series.id === seriesId
  )!;

  const scheduledItems = getScheduledItems({
    articles: articles.results,
    series,
  });

  return {
    props: serialiseProps({
      series,
      articles: {
        ...articles,
        results: sortSeriesItems({
          series,
          articles: articles.results.map(transformArticleToArticleBasic),
        }),
      },
      scheduledItems,
      serverData,
      gaDimensions: {
        partOf: series.seasons.map(season => season.id),
      },
      pageview: {
        name: 'story',
        properties: { type: series.type },
      },
    }),
  };
};

const ArticleSeriesPage: FunctionComponent<Props> = props => {
  const { series, articles, scheduledItems } = props;
  const breadcrumbs = {
    items: [
      {
        url: '/stories',
        text: 'Stories',
      },
      {
        url: `/series/${series.id}`,
        text: series.title,
        isHidden: true,
      },
    ],
  };

  const ContentTypeInfo = series.standfirst && (
    <PageHeaderStandfirst html={series.standfirst} />
  );
  const FeaturedMedia = getFeaturedMedia(series);
  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={{ labels: series.labels }}
      title={series.title}
      ContentTypeInfo={ContentTypeInfo}
      Background={
        <HeaderBackground
          hasWobblyEdge={true}
          backgroundTexture={headerBackgroundLs}
        />
      }
      FeaturedMedia={FeaturedMedia}
      isContentTypeInfoBeforeMedia={true}
    />
  );

  const paginationRoot = `/series/${series.id}`;

  return (
    <PageLayout
      title={series.title}
      description={series.metadataDescription || series.promo?.caption || ''}
      url={{ pathname: paginationRoot }}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="stories"
      openGraphType="website"
      image={series.image}
      apiToolbarLinks={[createPrismicLink(series.id)]}
    >
      <ContentPage
        id={series.id}
        Header={Header}
        Body={<Body body={series.body} pageId={series.id} />}
        contributors={series.contributors}
        seasons={series.seasons}
      >
        <>
          {articles.results.map((article, index) => (
            <SeriesItem key={index} $isFirst={index === 0}>
              <ArticleCard
                article={article}
                showPosition={true}
                xOfY={{
                  x: index + 1,
                  y: articles.results.length + scheduledItems.length,
                }}
              />
            </SeriesItem>
          ))}
          {scheduledItems.map((item, index) => (
            <SeriesItem key={index} $isFirst={false}>
              <ArticleScheduleItemCard
                item={item}
                xOfY={{
                  x: articles.results.length + index + 1,
                  y: articles.results.length + scheduledItems.length,
                }}
              />
            </SeriesItem>
          ))}
        </>
        {articles.totalPages > 1 && (
          <PaginationWrapper $verticalSpacing="m" $alignRight>
            <Pagination
              totalPages={articles.totalPages}
              ariaLabel="Series pagination"
            />
          </PaginationWrapper>
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default ArticleSeriesPage;
