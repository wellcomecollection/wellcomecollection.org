import * as prismic from '@prismicio/client';
import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { bodySquabblesSeries as bodySquabblesSeriesId } from '@weco/common/data/hardcoded-ids';
import {
  SeriesDocument,
  WebcomicSeriesDocument,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { serialiseProps } from '@weco/common/utils/json';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader';
import PageLayout from '@weco/common/views/components/PageLayout';
import PaginationWrapper from '@weco/common/views/components/styled/PaginationWrapper';
import Standfirst from '@weco/common/views/slices/Standfirst';
import ArticleCard from '@weco/content/components/ArticleCard';
import ArticleScheduleItemCard from '@weco/content/components/ArticleScheduleItemCard';
import Body from '@weco/content/components/Body';
import ContentPage from '@weco/content/components/ContentPage';
import Pagination from '@weco/content/components/Pagination';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { fetchSeriesById } from '@weco/content/services/prismic/fetch/series';
import {
  getScheduledItems,
  sortSeriesItems,
} from '@weco/content/services/prismic/transformers/article-series';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from '@weco/content/services/prismic/transformers/articles';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  transformSeries,
  transformWebcomicSeries,
} from '@weco/content/services/prismic/transformers/series';
import { seasonsFetchLinks } from '@weco/content/services/prismic/types';
import { ArticleScheduleItem } from '@weco/content/types/article-schedule-items';
import { ArticleBasic } from '@weco/content/types/articles';
import { Series } from '@weco/content/types/series';
import { getFeaturedMedia } from '@weco/content/utils/page-header';
import { getPage } from '@weco/content/utils/query-params';
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
  const { seriesId: seriesQueryId } = context.query;

  if (!looksLikePrismicId(seriesQueryId)) {
    return { notFound: true };
  }

  const serverData = await getServerData(context);
  const page = getPage(context.query);

  if (typeof page !== 'number') {
    return appError(context, 400, page.message);
  }

  const client = createClient(context);

  // GOTCHA: This is for a series where we have the `webcomics` type.
  // i.e.  the body squabbles series.
  // This will have to remain like this until we figure out how to migrate them.
  // We create new webcomics as an article with comic format, and add
  // an article-series to them.
  const isWebcomics = seriesQueryId === bodySquabblesSeriesId;

  const seriesDocument = await fetchSeriesById(
    client,
    seriesQueryId,
    isWebcomics ? 'webcomic-series' : 'series'
  );

  if (!seriesDocument) {
    return { notFound: true };
  }

  const series = isWebcomics
    ? transformWebcomicSeries(seriesDocument as WebcomicSeriesDocument)
    : transformSeries(seriesDocument as SeriesDocument);

  const seriesField = isWebcomics
    ? 'my.webcomics.series.series'
    : 'my.articles.series.series';

  // We need the actual ID, not the uid, to fetch related documents
  const seriesId = seriesDocument.id;

  const articlesQuery = await fetchArticles(client, {
    filters: [prismic.filter.at(seriesField, seriesId)],
    page,
    pageSize: 20,
    fetchLinks: seasonsFetchLinks,
  });

  const articles = transformQuery(articlesQuery, transformArticle);

  // We've seen people trying to request a high-numbered page for a series,
  // presumably by guessing at URLs, e.g. /series/W-XBJxEAAKmng1TG?page=500.
  // If the requested page is higher than the number of available pages we 404 (except on the first page)
  if (page > 1 && page > articlesQuery.total_pages) {
    return { notFound: true };
  }

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
        url: linkResolver(series),
        text: series.title,
        isHidden: true,
      },
    ],
  };

  const ContentTypeInfo = series.untransformedStandfirst ? (
    <Standfirst
      slice={series.untransformedStandfirst}
      index={0}
      context={{}}
      slices={[]}
    />
  ) : null;

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

  return (
    <PageLayout
      title={series.title}
      description={series.metadataDescription || series.promo?.caption || ''}
      url={{ pathname: `/series/${series.uid}` }}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="stories"
      openGraphType="website"
      image={series.image}
      apiToolbarLinks={[createPrismicLink(series.id)]}
    >
      <ContentPage
        id={series.id}
        Header={Header}
        Body={
          <Body
            untransformedBody={series.untransformedBody}
            pageId={series.id}
          />
        }
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
