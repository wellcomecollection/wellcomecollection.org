// @flow
import entities from 'entities';
import {type Picture} from './picture';
import {type  ArticleSeries} from "./series";
export type ArticlePromo = {|
  url: string;
  headline: string;
  description: string;
  thumbnail?: Picture;
  datePublished: Date;
  series?: Array<ArticleSeries>;
|};

export class ArticlePromoFactory {
  static fromWpApi(json): ArticlePromo {
    const url = `/articles/${json.slug}`; // TODO: this should be discoverable, not hard coded
    const headline = entities.decode(json.title);
    const description = json.excerpt;
    const wpThumbnail = json.post_thumbnail;
    const thumbnail: Picture = {
      contentUrl: wpThumbnail.URL,
      width: wpThumbnail.width,
      height: wpThumbnail.height
    };
    const datePublished = new Date(json.date);
    const series: Array<ArticleSeries> = Object.keys(json.categories).map(catKey => {
      const cat = json.categories[catKey];
      return {
        url: cat.slug,
        name: cat.name,
        description: cat.description
      }
    });

    const articlePromo: ArticlePromo = { url, headline, description, thumbnail, datePublished, series };
    return articlePromo;
  }
}
