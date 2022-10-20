import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import PageHeaderStandfirst from '../components/PageHeaderStandfirst/PageHeaderStandfirst';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import { getFeaturedMedia } from '../utils/page-header';
import { Series } from '../types/series';
import { ArticleBasic } from '../types/articles';
import { seasonsFields } from '@weco/common/services/prismic/fetch-links';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { GaDimensions } from '@weco/common/services/app/google-analytics';
import { appError, AppErrorProps } from '@weco/common/services/app';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import Body from '../components/Body/Body';
import SearchResults from '../components/SearchResults/SearchResults';
import ContentPage from '../components/ContentPage/ContentPage';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { createClient } from '../services/prismic/fetch';
import { bodySquabblesSeries } from '@weco/common/data/hardcoded-ids';
import { fetchArticles } from '../services/prismic/fetch/articles';
import * as prismic from '@prismicio/client';
import { transformArticleSeries } from '../services/prismic/transformers/article-series';
import { getPage } from '../utils/query-params';
import { PaginatedResults } from '@weco/common/services/prismic/types';
import {
  transformArticle,
  transformArticleToArticleBasic,
} from 'services/prismic/transformers/articles';
import { transformQuery } from 'services/prismic/transformers/paginated-results';
import Space from '@weco/common/views/components/styled/Space';
import Pagination from '@weco/common/views/components/Pagination/Pagination';
import styled from 'styled-components';

type Props = {
  series: Series;
  articles: PaginatedResults<ArticleBasic>;
  gaDimensions: GaDimensions;
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);

    const { id } = context.query;

    if (!looksLikePrismicId(id)) {
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
      id === bodySquabblesSeries
        ? 'my.webcomics.series.series'
        : 'my.articles.series.series';

    const articlesQuery = await fetchArticles(client, {
      predicates: [prismic.predicate.at(seriesField, id)],
      page,
      pageSize: 20,
      fetchLinks: seasonsFields,
    });

    // This can occasionally occur if somebody in the Editorial team is
    // trying to preview a series that doesn't have any entries yet.
    //
    // It should never happen for live content so we don't support it;
    // the log is to make it easier to debug if somebody tries it.
    if (articlesQuery.total_results_size === 0) {
      console.warn(`Series ${id} doesn't contain any articles`);
      return { notFound: true };
    }

    // We've seen people trying to request a high-numbered page for a series,
    // presumably by guessing at URLs, e.g. /series/W-XBJxEAAKmng1TG?page=500.
    //
    // The transformArticleSeries method expects to get a non-empty list of
    // articles, so if this page doesn't have any articles, let's 404 here.
    //
    // Note: this is a debug rather than a warn because it's more likely to be
    // somebody guessing about our URL scheme than somebody in Editorial looking
    // at a yet-to-be-published series.
    //
    // Note: we may be able to remove this once we refactor transformArticleSeries,
    // see https://github.com/wellcomecollection/wellcomecollection.org/issues/8516
    if (articlesQuery.results_size === 0) {
      console.debug(`Series ${id} doesn't have any articles on page ${page}`);
      return { notFound: true };
    }

    const { articles, series } = transformArticleSeries(id, articlesQuery);

    const paginatedArticles = transformQuery(articlesQuery, article =>
      transformArticleToArticleBasic(transformArticle(article))
    );

    return {
      props: removeUndefinedProps({
        series,
        articles: {
          ...paginatedArticles,
          articles,
        },
        serverData,
        gaDimensions: {
          partOf: series.seasons.map(season => season.id),
        },
      }),
    };
  };

const ArticleSeriesPage: FunctionComponent<Props> = props => {
  const { series, articles } = props;
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

  const PaginationWrapper = styled(Space).attrs({
    v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  })`
    text-align: right;
  `;

  return (
    <PageLayout
      title={series.title}
      description={series.metadataDescription || series.promo?.caption || ''}
      url={{ pathname: paginationRoot }}
      jsonLd={{ '@type': 'WebPage' }}
      siteSection="stories"
      openGraphType="website"
      image={series.image}
    >
      <ContentPage
        id={series.id}
        Header={Header}
        Body={<Body body={series.body} pageId={series.id} />}
        contributors={series.contributors}
        seasons={series.seasons}
      >
        <SearchResults items={series.items} showPosition={true} />
        {articles.totalPages > 1 && (
          <PaginationWrapper>
            <Pagination
              paginatedResults={articles}
              paginationRoot={{
                href: {
                  pathname: paginationRoot,
                },
                as: {
                  pathname: paginationRoot,
                },
              }}
            />
          </PaginationWrapper>
        )}
      </ContentPage>
    </PageLayout>
  );
};

export default ArticleSeriesPage;
