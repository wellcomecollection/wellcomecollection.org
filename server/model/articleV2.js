// @flow
import {type Person} from './person';
import {type Picture} from './picture';
import {getWpFeaturedImage} from './media';
import {bodyParser} from '../util/body-parser';

export type BodyPart = {};

export type ArticleV2 = {|
  headline: string;
  standfirst: string;
  // TODO: this will probably, at some stage be able to be video/audio/gallery etc
  // It's also an Array because it's not unfathomable to think of having
  // an audio and image mainMedia.
  mainMedia: Array<Picture>;
  articleBody: string;
  associatedMedia: Array<Picture>;
  author: Person;
  bodyParts: Array<BodyPart>;
|}

function createArticle(data: ArticleV2) {
  return (data: ArticleV2);
}

export class ArticleFactory {
  static fromWpApi(json): ArticleV2 {
    const articleBody = json.content;

    const mainImage: Picture = getWpFeaturedImage(json.featured_image, json.attachments);

    const author: Person = {
      givenName: json.author.first_name,
      familyName: json.author.last_name,
      name: `${json.author.first_name} ${json.author.last_name}`,
      image: json.author.avatar_URL,
      sameAs: [{ wordpress: json.author.URL }]
    };

    const bodyParts = bodyParser(articleBody);
    const standfirst = bodyParts.find(part => part.type === 'standfirst');

    const article: ArticleV2 = {
      headline: json.title,
      standfirst: standfirst,
      mainMedia: [mainImage],
      articleBody: articleBody,
      associatedMedia: [mainImage],
      author: author,
      bodyParts: bodyParts
    };

    return article;
  }
}
