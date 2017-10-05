// @flow
import {List} from 'immutable';
import type {Exhibition} from '../content-model/exhibition';
import getBreakpoint from '../filters/get-breakpoint';
import {getPromo, asText, asHtml, prismicImageToPicture} from './prismic-content';

export function parseExhibitionsDoc(doc): Exhibition {
  const featuredImage = prismicImageToPicture({image: doc.data.featuredImage});
  const featuredImageMobileCrop = prismicImageToPicture({image: doc.data.featuredImageMobileCrop});
  const featuredImageWithBreakpoint = featuredImage.contentUrl && Object.assign({}, featuredImage, {minWidth: getBreakpoint('medium')});
  const featuredImageMobileCropWithBreakpoint = featuredImageMobileCrop.contentUrl && Object.assign({}, featuredImageMobileCrop, {minWidth: getBreakpoint('small')});
  const featuredImages = List([featuredImageWithBreakpoint, featuredImageMobileCropWithBreakpoint].filter(_ => _));
  const promo = getPromo(doc);

  const exhibition = ({
    id: doc.id,
    title: asText(doc.data.title),
    subtitle: asText(doc.data.subtitle),
    start: doc.data.start,
    end: doc.data.end,
    featuredImages: featuredImages,
    featuredImage: featuredImages.first(),
    description: asHtml(doc.data.description),
    promo: promo
  }: Exhibition);

  return exhibition;
}
