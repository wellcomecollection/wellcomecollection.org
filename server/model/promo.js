// @flow
import type {UiComponent} from './ui-component';
import type {Weight} from './weight';
import type {Picture} from './picture';
import type {Chapter} from './chapter';
import type {ContentType} from './content-type';
import type {ArticleSeries} from './series';
import type {ArticleStub} from './article-stub';

export type Promo = UiComponent & {
  type?: 'promo';
  url?: ?string;
  title: string;
  image?: ?Picture;
  contentType: ContentType;
  description?: string;
  chapter?: Chapter;
  length?: number;
  datePublished?: ?Date;
  series?: Array<ArticleSeries>;
}

export function createPromo(data: Promo) { return (data: Promo); }

export class PromoFactory {
  static fromArticleStub(articleStub: ArticleStub, weight: Weight = 'default'): Promo {
    return ({
      type: 'promo',
      url: articleStub.url,
      title: articleStub.headline,
      image: articleStub.thumbnail,
      contentType: articleStub.contentType,
      weight: weight,
      description: articleStub.description,
      datePublished: articleStub.datePublished,
      series: articleStub.series,
      positionInSeries: articleStub.positionInSeries
    }: Promo);
  }
}
