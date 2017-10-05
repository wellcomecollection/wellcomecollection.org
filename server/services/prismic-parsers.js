// @flow
import {List} from 'immutable';
import type {Exhibition} from '../content-model/exhibition';
import getBreakpoint from '../filters/get-breakpoint';
import {getPromo, asText, asHtml, prismicImageToPicture, getContributors} from './prismic-content';
import type {DateRange} from '../content-model/content-blocks';
import type {EventFormat} from '../content-model/event';

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


export function parseEventDoc(doc): Event {
  const contributors = getContributors(doc);
  const promo = getPromo(doc);
  const when: List<DateRange> = List(doc.data.when.map(slice => {
    return ({
      start: new Date(slice.primary.start),
      end: new Date(slice.primary.end)
    }: DateRange);
  }));

  const e = ({
    id: doc.id,
    title: asText(doc.data.title),
    format: doc.data.format.data && ({ title: asText(doc.data.format.data.title) }: EventFormat),
    programme: doc.data.programme.data && ({ title: asText(doc.data.programme.data.title) }: EventFormat),
    when: when,
    description: asHtml(doc.data.description),
    accessOptions: List(doc.data.accessOptions.map(ao => ({
      accessOption: { title: asText(ao.accessOption.data.title), acronym: ao.accessOption.data.acronym }
    }))),
    bookingEnquiryTeam: doc.data.bookingEnquiryTeam.data && {
      title: asText(doc.data.bookingEnquiryTeam.data.title),
      email: doc.data.bookingEnquiryTeam.data.email,
      phone: doc.data.bookingEnquiryTeam.data.phone
    },
    bookingInformation: asHtml(doc.data.bookingInformation),
    contributors: contributors,
    promo: promo
  }: Event);

  return e;
}
