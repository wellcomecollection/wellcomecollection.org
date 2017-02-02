// @flow
import entities from 'entities';
import {Person} from './person';
import {getWpFeaturedImage} from './media';
import {bodyParser} from '../util/body-parser';
import {type Picture} from './picture';

type ComponentType =
  | 'imageGallery'
  | 'picture'
  | 'video'
  | 'list'
  | 'tweet'
  | 'heading';

type ComponentWeight =
  | 'default'
  | 'leading'
  | 'standalone'
  | 'supporting';

export type BodyPart = {};

export type Component<T> = {|
  weight: ComponentWeight;
  type: ComponentType;
  value: T;
|}

export type ArticleV2 = {|
  headline: string;
  standfirst: string;
  articleBody: string;
  associatedMedia: Array<Component<Picture>>;
  // author: Person;
  bodyParts: Array<Component<BodyPart>>;
|}

function article(data: ArticleV2) {
  return (data: ArticleV2);
}

class ArticleFactory {
  static fromWpApi(json) {
    const mainImage: Picture = getWpFeaturedImage(json.featured_image, json.attachments);
    const mainImageComponent = ({
      weight: 'leading',
      type: 'picture',
      value: mainImage
    }: Component<Picture>);

    const a = article({
      headline: json.title,
      standfirst: 'standfirst',
      articleBody: json.content,
      associatedMedia: [mainImageComponent],
      bodyParts: []
    });


    // const p = article({'ajsdaksjhd': 'aslkdjaslkdj'})
  }
}
