// @flow
// type: ui-component
import {type UiComponent} from './ui-component';
import {type Weight} from './weight';
import {type Picture} from './picture';
import {type Chapter} from './chapter';
import {type ContentType} from './content-type';
import {type ArticleStub} from './article-stub';

export type Promo = UiComponent & {
  url: string;
  title: string;
  image?: ?Picture;
  contentType: ContentType;
  description?: string;
  chapter?: Chapter;
  length?: number;
}

export function createPromo(data: Promo) { return (data: Promo); }

export class PromoFactory {
  static fromArticleStub(articleStub: ArticleStub, weight: Weight = 'default'): Promo {
    return ({
      url: articleStub.url,
      title: articleStub.headline,
      image: articleStub.thumbnail,
      contentType: articleStub.contentType,
      weight: weight,
      description: articleStub.description
    } : Promo);
  }
}
