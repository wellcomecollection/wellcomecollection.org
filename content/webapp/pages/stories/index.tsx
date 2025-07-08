import * as prismic from '@prismicio/client';
import { NextPage } from 'next';

import { StoriesLandingDocument as RawStoriesLandingDocument } from '@weco/common/prismicio-types';
import { getServerData } from '@weco/common/server-data';
import { serialiseProps } from '@weco/common/utils/json';
import {
  ServerSideProps,
  ServerSidePropsOrAppError,
} from '@weco/common/views/pages/_app';
import { ArticleFormatIds } from '@weco/content/data/content-format-ids';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchArticles } from '@weco/content/services/prismic/fetch/articles';
import { fetchStoriesLanding } from '@weco/content/services/prismic/fetch/stories-landing';
import { transformArticle as transformPrismicArticle } from '@weco/content/services/prismic/transformers/articles';
import { articleLdContentApi } from '@weco/content/services/prismic/transformers/json-ld';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { transformSeriesToSeriesBasic } from '@weco/content/services/prismic/transformers/series';
import { transformStoriesLanding } from '@weco/content/services/prismic/transformers/stories-landing';
import { getArticles } from '@weco/content/services/wellcome/content/articles';
import { Series } from '@weco/content/types/series';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import StoriesPage, {
  Props as StoriesPageProps,
} from '@weco/content/views/pages/stories';

const Page: NextPage<StoriesPageProps> = props => {
  return <StoriesPage {...props} />;
};

type Props = ServerSideProps<StoriesPageProps>;

export const getServerSideProps: ServerSidePropsOrAppError<
  Props
> = async context => {
  setCacheControl(context.res);
  const serverData = await getServerData(context);
  const client = createClient(context);

  const comicsQueryPromise = fetchArticles(client, {
    pageSize: 100, // we need enough comics to make sure we have at least one from three different series
    filters: prismic.filter.at('my.articles.format', ArticleFormatIds.Comic),
  });

  const storiesLandingPromise = fetchStoriesLanding(client);
  const articlesResponsePromise = getArticles({
    params: {},
    pageSize: 11,
    toggles: serverData.toggles,
  });

  const [articlesResponse, storiesLandingDoc, comicsQuery] = await Promise.all([
    articlesResponsePromise,
    storiesLandingPromise,
    comicsQueryPromise,
  ]);

  const articles =
    articlesResponse.type === 'ResultList' ? articlesResponse.results : [];

  // In order to avoid the case where we end up with an empty comic series,
  // rather than querying for the series itself we query for the individual
  // comics, then group them by series and stop once we've got to three. That
  // way we can be confident each of the three series that we have contains at
  // least one comic.
  const comics = transformQuery(comicsQuery, transformPrismicArticle);
  const comicSeries = new Map<string, Series>();
  for (const comic of comics.results) {
    const series = comic.series[0];
    if (series?.id && !comicSeries.has(series.id)) {
      comicSeries.set(series.id, series);
    }
    if (comicSeries.size === 3) {
      break;
    }
  }

  const basicComicSeries = Array.from(comicSeries.values()).map(
    transformSeriesToSeriesBasic
  );

  const jsonLd = articles.map(articleLdContentApi);
  const storiesLanding =
    storiesLandingDoc &&
    transformStoriesLanding(storiesLandingDoc as RawStoriesLandingDocument);

  if (articles) {
    return {
      props: serialiseProps<Props>({
        articles,
        comicSeries: basicComicSeries,
        serverData,
        jsonLd,
        storiesLanding,
      }),
    };
  } else {
    return { notFound: true };
  }
};

export default Page;
