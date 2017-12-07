import {Exhibition} from '../content-model/exhibition';

export type ExhibitionAndRelatedContent = {|
  exhibition: Exhibition;
  galleryLevel: string;
  relatedBooks: Array<Promo>;
  relatedEvents: Array<Promo>;
  relatedGalleries: Array<Promo>;
  relatedArticles: Array<Promo>;
  imageGallery: any;
  textAndCaptionsDocument: any;
|}
