import {Person} from './person';
import {getWpFeaturedImage} from './media';
import {bodyParser} from '../util/body-parser';

// TODO: This needs a better model.
export default class Article {
  constructor(headline, articleBody, mainImage, associatedMedia, author, mainMedia) {
    this.headline = headline;
    this.articleBody = articleBody;
    this.mainImage = mainImage;
    this.associatedMedia = associatedMedia;
    this.author = author;
    this.mainMedia = mainMedia;
    this.bodyParts = bodyParser(articleBody);
  }

  static fromDrupalApi(json) {
    return new Article(json.headline, json.articleBody, json.mainImage, json.associatedMedia);
  }

  static fromWpApi(json) {
      const mainImage = getWpFeaturedImage(json.featured_image, json.attachments);
      const author = new Person({
        givenName: json.author.first_name,
        familyName: json.author.last_name,
        name: `${json.author.first_name} ${json.author.last_name}`,
        image: json.author.avatar_URL,
        sameAs: [{ wordpress: json.author.URL }]
      });
      return new Article(json.title, json.content, mainImage, [mainImage], author, [mainImage]);
  }
}

function getMainMedia(associatedMedia) {
  // This is to make sure we don't serve the main image and the main video
  const video = associatedMedia.find(m => m.weighting === 'leading' && m.mediaType === 'video');
  const image = associatedMedia.find(m => m.weighting === 'leading' && m.mediaType === 'image');
  const audio = associatedMedia.find(m => m.weighting === 'leading' && m.mediaType === 'audio');
  const gallery = associatedMedia.find(m => m.weighting === 'leading' && m.mediaType === 'gallery');

  return [(gallery || video || image), audio];
}
