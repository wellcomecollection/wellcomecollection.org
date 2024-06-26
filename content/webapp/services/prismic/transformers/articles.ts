import { Article, ArticleBasic } from '../../../types/articles';
import {
  ArticlesDocument as RawArticlesDocument,
  SeriesDocument as RawSeriesDocument,
  SeasonsDocument as RawSeasonsDocument,
  WebcomicsDocument as RawWebcomicsDocument,
} from '@weco/common/prismicio-types';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import {
  transformGenericFields,
  transformLabelType,
  transformSingleLevelGroup,
} from '.';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { Label } from '@weco/common/model/labels';
import { Series } from '../../../types/series';
import { transformSeason } from './seasons';
import { transformSeries, transformSeriesToSeriesBasic } from './series';
import { Format } from '../../../types/format';
import { ArticleFormatId } from '@weco/content/data/content-format-ids';
import { transformContributors } from './contributors';
import { noAltTextBecausePromo } from './images';
import {
  calculateReadingTime,
  showReadingTime,
} from '@weco/content/utils/reading-time';

export function transformArticleToArticleBasic(article: Article): ArticleBasic {
  // returns what is required to render StoryPromos and story JSON-LD

  return (({
    type,
    id,
    promo,
    series,
    title,
    format,
    image,
    datePublished,
    labels,
    color,
  }) => ({
    type,
    id,
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

  return {
    ...genericFields,
    type: 'articles',
    labels: labels.length > 0 ? labels : [{ text: 'Story' }],
    format,
    series,
    contributors,
    readingTime: showReadingTime(format, labels)
      ? calculateReadingTime(genericFields.untransformedBody)
      : undefined,
    datePublished: new Date(datePublished),
    seasons: isArticle(document)
      ? transformSingleLevelGroup(document.data.seasons, 'season').map(season =>
          transformSeason(season as RawSeasonsDocument)
        )
      : [],
  };
}
