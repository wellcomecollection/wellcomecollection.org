// @flow
import {List} from 'immutable';
import type {Exhibition} from '../content-model/exhibition';
import getBreakpoint from '../filters/get-breakpoint';
import {
  getPromo, asText, asHtml, prismicImageToPicture, getContributors, getPublishedDate,
  getFeaturedMediaFromBody, convertContentToBodyParts, getSeries
} from './prismic-content';
import type {DateRange} from '../content-model/content-blocks';
import type {EventFormat} from '../content-model/event';
import type {Article} from '../model/article';

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

export function parseArticleDoc(doc): Article {
  // TODO : construct this not from strings
  const url = `/articles/${doc.id}`;

  const publishDate = getPublishedDate(doc);
  const featuredMedia = getFeaturedMediaFromBody(doc);

  // TODO: Don't convert this into thumbnail
  const promo = doc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);
  const description = promo && asText(promo.primary.caption); // TODO: Do not use description
  const contributors = getContributors(doc);
  const series = getSeries(doc);

  const bodyParts = convertContentToBodyParts(doc.data.body);

  // TODO: The whole scheduled content has some work to be getting on with
  const seriesWithCommissionedLength = series.find(series => series.commissionedLength);
  const positionInSeries = seriesWithCommissionedLength && (seriesWithCommissionedLength.positionInSeries || 1);

  const article: Article = {
    contentType: 'article',
    headline: asText(doc.data.title),
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: contributors,
    series: series,
    bodyParts: bodyParts,
    mainMedia: [featuredMedia],
    description: description,
    positionInSeries: positionInSeries
  };

  return article;
}

export function parseWebcomicDoc(doc): Article {
  // TODO : construct this not from strings
  const url = `/articles/${doc.id}`;

  // TODO: potentially get rid of this
  const publishDate = getPublishedDate(doc);
  const mainMedia = [prismicImageToPicture({ image: doc.data.image })];

  // TODO: Don't convert this into thumbnail
  const promo = doc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && prismicImageToPicture(promo.primary);
  const description = asText(promo.primary.caption); // TODO: Do not use description
  const contributors = getContributors(doc);
  const series = getSeries(doc);

  const article: Article = {
    contentType: 'comic',
    headline: asText(doc.data.title),
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: contributors,
    series: series,
    bodyParts: [],
    mainMedia: mainMedia,
    description: description
  };

  return article;
}
