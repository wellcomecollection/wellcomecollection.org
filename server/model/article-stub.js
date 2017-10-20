// @flow
import entities from 'entities';
import type {ContentType} from './content-type';
import { getContentTypeFromWPType } from './content-type';
import type {Picture} from './picture';
import type {ArticleSeries} from './series';
import { getSeriesCommissionedLength, getPositionInSeries, getSeriesColor } from '../data/series';
export type ArticleStub = {|
  contentType: ContentType;
  url: string;
  headline: string;
  description: string;
  thumbnail?: ?Picture;
  datePublished: Date;
  series?: Array<ArticleSeries>;
  positionInSeries?: ?number;
|};

export class ArticleStubFactory {
  static fromWpApi(json): ArticleStub {
    const positionInSeries = getPositionInSeries(json.tags);
    const contentType = getContentTypeFromWPType(json.format);
    const url = `/articles/${json.slug}`; // TODO: this should be discoverable, not hard coded
    const headline = entities.decode(json.title);
    const description = entities.decode(json.excerpt);
    const wpThumbnail = json.post_thumbnail || null;
    const thumbnail: ?Picture = wpThumbnail ? {
      type: 'picture',
      contentUrl: wpThumbnail.URL,
      width: wpThumbnail.width,
      height: wpThumbnail.height
    } : null;
    const datePublished = new Date(json.date);
    const series: Array<ArticleSeries> = Object.keys(json.categories).map(catKey => {
      const cat = json.categories[catKey];
      return ({
        url: cat.slug,
        name: cat.name,
        description: cat.description,
        commissionedLength: getSeriesCommissionedLength(cat.slug),
        color: getSeriesColor(cat.slug)
      } : ArticleSeries);
    });

    const articleStub: ArticleStub = { contentType, url, headline, description, thumbnail, datePublished, series, positionInSeries };
    return articleStub;
  }
}
