import * as prismic from '@prismicio/client';

import { Label } from '@weco/common/model/labels';
import {
  ArticlesDocument as RawArticlesDocument,
  SeriesDocument as RawSeriesDocument,
  WebcomicsDocument as RawWebcomicsDocument,
} from '@weco/common/prismicio-types';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { ArticleFormatId } from '@weco/content/data/content-format-ids';
import { Article, ArticleBasic } from '@weco/content/types/articles';
import { Format } from '@weco/content/types/format';
import { Series } from '@weco/content/types/series';
import { getWorksIdsFromDocumentBody } from '@weco/content/utils/extract-works-ids';
import {
  calculateReadingTime,
  showReadingTime,
} from '@weco/content/utils/reading-time';

import {
  transformGenericFields,
  transformLabelType,
  transformSingleLevelGroup,
} from '.';
import { transformContributors } from './contributors';
import { noAltTextBecausePromo } from './images';
import { transformSeasonsFromRelationshipGroup } from './seasons';
import { transformSeries, transformSeriesToSeriesBasic } from './series';

export function transformArticleToArticleBasic(article: Article): ArticleBasic {
  // returns what is required to render StoryCards and story JSON-LD

  return (({
    type,
    id,
    uid,
    promo,
    series,
    title,
    format,
    image,
    datePublished,
    labels,
    color,
    hasLinkedWorks,
  }) => ({
    type,
    id,
    uid,
    promo: promo && {
      ...promo,
      image: promo.image && {
        ...promo.image,
        ...noAltTextBecausePromo,
        tasl: undefined,
      },
    },
    series: series.map(transformSeriesToSeriesBasic),
    title,
    format,
    datePublished,
    labels,
    color,
    hasLinkedWorks,
    // We only use the square crop of an image in the <ArticleCard> component,
    // so we can omit sending any other crops.
    image: image && {
      ...image,
      ...noAltTextBecausePromo,
      tasl: undefined,
      simpleCrops: image.simpleCrops?.square && {
        square: image.simpleCrops.square,
      },
      richCrops: image.richCrops?.square && {
        square: image.richCrops.square,
      },
    },
  }))(article);
}

export const isArticle = (
  doc: RawArticlesDocument | RawWebcomicsDocument
): doc is RawArticlesDocument => {
  return 'seasons' in doc.data;
};

export function transformArticle(
  document: RawArticlesDocument | RawWebcomicsDocument
): Article {
  const { data } = document;
  const genericFields = transformGenericFields(document);

  // When we imported data into Prismic from the Wordpress blog some content
  // needed to have its original publication date displayed. It is purely a display
  // value and does not affect ordering.
  const datePublished = data.publishDate || document.first_publication_date;

  const format = isFilledLinkToDocumentWithData(data.format)
    ? (transformLabelType(data.format) as Format<ArticleFormatId>)
    : undefined;

  const series: Series[] = transformSingleLevelGroup(data.series, 'series').map(
    series => transformSeries(series as RawSeriesDocument)
  );

  const labels: Label[] = [
    format ? { text: format.title || '' } : undefined,
    series.find(s => s.schedule.length > 0) ? { text: 'Serial' } : undefined,
  ].filter(isNotUndefined);

  const contributors = transformContributors(document);

  const workIds = getWorksIdsFromDocumentBody(data.body);
  const hasLinkedWorks = workIds.length > 0;

  // The content will be fetched client side later on
  const exploreMoreDocument =
    'exploreMoreDocument' in data &&
    prismic.isFilled.contentRelationship(data.exploreMoreDocument)
      ? {
          id: data.exploreMoreDocument.id,
          uid: data.exploreMoreDocument.uid,
          type: data.exploreMoreDocument.type,
        }
      : undefined;

  return {
    ...genericFields,
    type: 'articles',
    uid: document.uid,
    labels: labels.length > 0 ? labels : [{ text: 'Story' }],
    format,
    series,
    contributors,
    readingTime: showReadingTime(format, labels)
      ? calculateReadingTime(genericFields.untransformedBody)
      : undefined,
    datePublished: new Date(datePublished),
    seasons: isArticle(document)
      ? transformSeasonsFromRelationshipGroup(
          transformSingleLevelGroup(document.data.seasons, 'season')
        )
      : [],
    exploreMoreDocument,
    hasLinkedWorks,
  };
}
