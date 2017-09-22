import entities from 'entities';
import {List} from 'immutable';
import type {Person} from './person';
import type {Picture} from './picture';
import type {ContentType} from './content-type';
import { getContentType } from './content-type';
import type {VideoEmbed} from './video-embed';
import type {ArticleSeries} from './series';
import {getSeriesCommissionedLength, getSeriesColor, getPositionInSeries} from '../data/series';
import {getWpFeaturedImage} from './media';
import {bodyParser} from '../util/body-parser';
import {authorMap} from '../services/author-lookup';

export type BodyPart = {};

export type Article = {|
  contentType: ContentType;
  url: string;
  headline: string;
  standfirst: string;
  description: string;
  datePublished: Date;
  // TODO: this will probably, at some stage be able to be video/audio/gallery etc
  // It's also an Array because it's not unfathomable to think of having
  // an audio and image mainMedia.
  mainMedia: Array<Picture | VideoEmbed>;
  thumbnail?: ?Picture;
  articleBody: string;
  associatedMedia: Array<Picture>;
  bodyParts: Array<BodyPart>;
  author?: Person; // TODO: Make this mandatory once we know all the authors
  series?: Array<ArticleSeries>;
  positionInSeries?: ?number;
|}

export class ArticleFactory {
  static fromWpApi(json): Article {
    const positionInSeries = getPositionInSeries(json.tags);
    const url = `/articles/${json.slug}`; // TODO: this should be discoverable, not hard coded
    const articleBody = json.content;
    const contentType = getContentType(json.format);
    const bodyPartsRaw = bodyParser(articleBody);
    const standfirst = bodyPartsRaw.find(part => part.type === 'standfirst');
    const mainComic: ?Picture = bodyPartsRaw[0] && bodyPartsRaw[0].type === 'picture' && contentType === 'comic' ? bodyPartsRaw[0].value : null;

    const mainVideo: ?VideoEmbed = bodyPartsRaw[0] && bodyPartsRaw[0].type === 'video-embed' ? bodyPartsRaw[0].value : null;
    const wpThumbnail = json.post_thumbnail;

    const thumbnail: ?Picture = wpThumbnail ? {
      type: 'picture',
      contentUrl: wpThumbnail.URL,
      width: wpThumbnail.width,
      height: wpThumbnail.height
    } : null;
    // Annoyingly Wordpress doesn't always send the featured image over with the attachments,
    // so we revert to the thumbnail.
    const mainImage: ?Picture = getWpFeaturedImage(json.featured_image, json.attachments) || thumbnail;
    const mainMedia: Array<VideoEmbed | Picture> = [(mainComic || mainImage), mainVideo].filter(Boolean);

    // If we have a video as the main media, remove it from the bodyParts to not let it show twice
    // This is due to the fact that WP doesn't allow you to set mainMedia as Youtube embeds.
    const bodyParts = (mainVideo || mainComic) ? List(bodyPartsRaw).skip(1).toJS() : bodyPartsRaw;

    const series: Array<ArticleSeries> = Object.keys(json.categories).map(catKey => {
      const cat = json.categories[catKey];
      return {
        url: cat.slug,
        name: cat.name,
        description: cat.description,
        commissionedLength: getSeriesCommissionedLength(cat.slug),
        color: getSeriesColor(cat.slug)
      };
    });

    const article: Article = {
      contentType: contentType,
      url: url,
      headline: entities.decode(json.title),
      standfirst: entities.decode(standfirst),
      description: entities.decode(json.excerpt),
      datePublished: new Date(json.date),
      mainMedia: mainMedia,
      thumbnail: thumbnail,
      articleBody: articleBody,
      associatedMedia: mainImage ? [mainImage] : [],
      author: [],
      bodyParts: bodyParts,
      series: series,
      positionInSeries: positionInSeries
    };

    return article;
  }
}
