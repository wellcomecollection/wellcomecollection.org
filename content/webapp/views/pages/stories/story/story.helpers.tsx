import { ReactElement } from 'react';

import { bodySquabblesSeries } from '@weco/common/data/hardcoded-ids';
import { ExhibitionsDocument as RawExhibitionsDocument } from '@weco/common/prismicio-types';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { transformTimestamp } from '@weco/common/services/prismic/transformers';
import { isPast } from '@weco/common/utils/dates';
import { fetchFromClientSide } from '@weco/content/services/prismic/fetch';
import { fetchArticlesClientSide } from '@weco/content/services/prismic/fetch/articles';
import {
  transformExhibition,
  transformExhibitionToExhibitionBasic,
} from '@weco/content/services/prismic/transformers/exhibitions';
import { getAddressable } from '@weco/content/services/wellcome/content/all';
import { getArticle } from '@weco/content/services/wellcome/content/article';
import {
  Article as ContentAPIArticle,
  ContentApiLinkedWork,
} from '@weco/content/services/wellcome/content/types/api';
import { Article, ArticleBasic } from '@weco/content/types/articles';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Series } from '@weco/content/types/series';

import { ArticleSeriesList } from '.';
import SeriesNavigation from './story.SeriesNavigation';

export const setSeries = async (
  article: Article,
  setListOfSeries: (series: ArticleSeriesList) => void
) => {
  const series = article.series[0];
  if (series) {
    const seriesField =
      series.id === bodySquabblesSeries
        ? 'my.webcomics.series.series'
        : 'my.articles.series.series';

    // Note: we deliberately use a hard-coded string here instead of the
    // filter DSL in the Prismic client library, because it means we don't
    // send the Prismic client library as part of the browser bundle.
    const filters = [`[at(${seriesField}, "${series.id}")]`];

    const articlesInSeries = series
      ? await fetchArticlesClientSide({ filters })
      : undefined;

    const articles = articlesInSeries?.results ?? [];

    if (series) {
      setListOfSeries([{ series, articles }]);
    }
  }
};

export const getRelatedDoc = async (
  article: Article,
  setRelatedDocument: (
    doc: ExhibitionBasic | ContentAPIArticle | undefined
  ) => void,
  serverData: SimplifiedServerData
) => {
  if (article.exploreMoreDocument?.type === 'exhibitions') {
    const relatedExhibition = await fetchFromClientSide<RawExhibitionsDocument>(
      {
        endpoint: 'exhibitions/exhibition',
        params: {
          id:
            article.exploreMoreDocument?.uid || article.exploreMoreDocument?.id,
        },
      }
    );

    if (relatedExhibition) {
      // We're hiding exhibitions once they've ended, so not setting the related document value.
      const isPastExhibition = isPast(
        transformTimestamp(relatedExhibition.data.end) || new Date()
      );

      if (!isPastExhibition) {
        const transformedRelatedExhibition =
          transformExhibitionToExhibitionBasic(
            transformExhibition(relatedExhibition)
          );
        setRelatedDocument(transformedRelatedExhibition);
      }
    }
  }

  if (article.exploreMoreDocument?.type === 'articles') {
    const relatedArticle = await getArticle({
      id: article.exploreMoreDocument.id,
      toggles: serverData.toggles,
    });

    if (relatedArticle?.type === 'Article') {
      setRelatedDocument(relatedArticle);
    }
  }
};

export const getLinkedWorks = async ({
  id,
  useStaging = false,
}: {
  id: string;
  useStaging?: boolean;
}): Promise<ContentApiLinkedWork[]> => {
  const addressable = await getAddressable({
    id,
    useStaging,
  });

  if (addressable.type !== 'Error') {
    return addressable.linkedWorks || [];
  }
  return [];
};

export const getNextUp = (
  series: Series,
  articles: ArticleBasic[],
  article: Article,
  currentPosition: number | undefined,
  isPodcast: boolean
): ReactElement | null => {
  if (series.schedule.length > 0 && currentPosition) {
    const firstArticleFromSchedule = series.schedule.find(
      i => i.partNumber === 1
    );
    const firstArticleTitle = firstArticleFromSchedule?.title;
    const firstArticle = articles.find(i => i.title === firstArticleTitle);

    const nextArticleFromSchedule = series.schedule.find(
      i => i.partNumber === currentPosition + 1
    );
    const nextArticleTitle = nextArticleFromSchedule?.title;
    const nextArticle = articles.find(i => i.title === nextArticleTitle);

    const nextUp =
      currentPosition === series.schedule.length && series.schedule.length > 1
        ? firstArticle
        : nextArticle || null;

    return nextUp ? (
      <SeriesNavigation
        series={series}
        items={[nextUp]}
        isPodcast={isPodcast}
      />
    ) : null;
  } else {
    const dedupedArticles = articles
      .filter(a => a.id !== article.id)
      .slice(0, 2);
    return (
      <SeriesNavigation
        series={series}
        items={dedupedArticles}
        isPodcast={isPodcast}
      />
    );
  }
};
