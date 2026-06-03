import * as prismic from '@prismicio/client';
import { NextPage } from 'next';

import { bodySquabblesSeries as bodySquabblesSeriesId } from '@weco/common/data/hardcoded-ids';
import {
  SeriesDocument,
  WebcomicSeriesDocument,
} from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { appError } from '@weco/common/services/app';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
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
import { getPage } from '@weco/content/utils/query-params';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import ArticleSeriesPage, {
  Props as ArticleSeriesPageProps,
} from '@weco/content/views/pages/series/series';

const Page: NextPage<ArticleSeriesPageProps> = props => {
  return <ArticleSeriesPage {...props} />;
};

type Props = ServerSideProps<ArticleSeriesPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
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
    props: serialiseProps<Props>({
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
    }),
  };
};

export default Page;
