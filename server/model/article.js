// @flow
import entities from 'entities';
import {type Person} from './person';
import {type Picture} from './picture';
import {type contentType} from './content-type';
import {getWpFeaturedImage} from './media';
import {bodyParser} from '../util/body-parser';

export type BodyPart = {};

export type Article = {|
  type: contentType;
  url: string;
  headline: string;
  standfirst: string;
  description: string;
  datePublished: Date;
  // TODO: this will probably, at some stage be able to be video/audio/gallery etc
  // It's also an Array because it's not unfathomable to think of having
  // an audio and image mainMedia.
  mainMedia: Array<Picture>;
  thumbnail: Picture;
  articleBody: string;
  associatedMedia: Array<Picture>;
  author: Person;
  bodyParts: Array<BodyPart>;
|}

function createArticle(data: Article) { return (data: Article); }

export class ArticleFactory {
  static fromWpApi(json): Article {
    const url = `/articles/${json.slug}`; // TODO: this should be discoverable, not hard coded
    const articleBody = json.content;

    const mainImage: Picture = getWpFeaturedImage(json.featured_image, json.attachments);
    const wpThumbnail = json.post_thumbnail;
    const thumbnail: Picture = {
      contentUrl: wpThumbnail.URL,
      width: wpThumbnail.width,
      height: wpThumbnail.height
    };

    const author: Person = {
      givenName: json.author.first_name,
      familyName: json.author.last_name,
      name: `${json.author.first_name} ${json.author.last_name}`,
      image: json.author.avatar_URL,
      sameAs: [{ wordpress: json.author.URL }]
    };

    const bodyParts = bodyParser(articleBody);
    const standfirst = bodyParts.find(part => part.type === 'standfirst');

    const article: Article = {
      type: "article",
      url: url,
      headline: entities.decode(json.title),
      standfirst: standfirst,
      description: json.excerpt,
      datePublished: new Date(json.date),
      mainMedia: [mainImage],
      thumbnail: thumbnail,
      articleBody: articleBody,
      associatedMedia: [mainImage],
      author: author,
      bodyParts: bodyParts
    };

    return article;
  }
}
