// @flow
import {List} from 'immutable';
import {RichText, Date as PrismicDate} from 'prismic-dom';
import type {Exhibition} from '../content-model/exhibition';
import type {Event} from '../content-model/event';
import getBreakpoint from '../filters/get-breakpoint';
import {parseBody} from './prismic-body-parser';
import type {Contributor, DateRange, ImagePromo} from '../content-model/content-blocks';
import type {EventFormat} from '../content-model/event';
import type {Article} from '../model/article';
import type {Promo} from '../model/promo';
import type {Picture} from '../model/picture';
import {isEmptyObj} from '../util/is-empty-obj';

// This is just JSON
type PrismicDoc = Object<any>;
// This is because it could be any part of a JSON doc
type PrismicDocFragment = Object<any> | Array<any>;

export function parseExhibitionsDoc(doc: PrismicDoc): Exhibition {
  const featuredImage = parsePicture({image: doc.data.featuredImage});
  const featuredImageMobileCrop = parsePicture({image: doc.data.featuredImageMobileCrop});
  const featuredImageWithBreakpoint = featuredImage.contentUrl && Object.assign({}, featuredImage, {minWidth: getBreakpoint('medium')});
  const featuredImageMobileCropWithBreakpoint = featuredImageMobileCrop.contentUrl && Object.assign({}, featuredImageMobileCrop, {minWidth: getBreakpoint('small')});
  const featuredImages = List([featuredImageWithBreakpoint, featuredImageMobileCropWithBreakpoint].filter(_ => _));
  const promo = parseImagePromo(doc.data.promo);

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

export function parseEventDoc(doc: PrismicDoc): Event {
  const contributors = parseContributors(doc.data.contributors);
  const promo = parseImagePromo(doc.data.promo);
  const when: List<DateRange> = List(doc.data.when.map(slice => {
    return ({
      start: new Date(slice.primary.start),
      end: new Date(slice.primary.end)
    }: DateRange);
  }));
  const featuredImage = parsePicture({image: doc.data.featuredImage});

  const e = ({
    id: doc.id,
    title: asText(doc.data.title),
    format: doc.data.format.data && ({ title: asText(doc.data.format.data.title) }: EventFormat),
    programme: doc.data.programme.data && ({ title: asText(doc.data.programme.data.title) }: EventFormat),
    when: when,
    description: asHtml(doc.data.description),
    featuredImage: featuredImage,
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

export function parseArticleDoc(doc: PrismicDoc): Article {
  // TODO : construct this not from strings
  const url = `/articles/${doc.id}`;

  const publishDate = parsePublishedDate(doc);
  const featuredMedia = parseFeaturedMediaFromBody(doc);

  // TODO: Don't convert this into thumbnail
  const promo = doc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && parsePicture(promo.primary);
  const description = promo && asText(promo.primary.caption); // TODO: Do not use description
  const contributors = parseContributors(doc.data.contributors);
  const series = parseSeries(doc.data.series);

  const bodyParts = parseBody(doc.data.body);

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

export function parseWebcomicDoc(doc: PrismicDoc): Article {
  // TODO : construct this not from strings
  const url = `/articles/${doc.id}`;

  // TODO: potentially get rid of this
  const publishDate = parsePublishedDate(doc);
  const mainMedia = [parsePicture({ image: doc.data.image })];

  // TODO: Don't convert this into thumbnail
  const promo = doc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && parsePicture(promo.primary);
  const description = asText(promo.primary.caption); // TODO: Do not use description
  const contributors = parseContributors(doc.data.contributors);
  const series = parseSeries(doc.data.series);

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

export function parsePromoListItem(item): Promo {
  return ({
    contentType: item.type,
    url: item.link.url,
    title: item.title[0].text,
    description: item.description[0].text,
    image: parsePicture(item)
  } : Promo);
}

export function parsePicture(captionedImage): Picture {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const tasl = image && image.copyright && parseTaslFromCopyright(image.copyright);

  return ({
    type: 'picture',
    contentUrl: image && image.url,
    width: image && image.dimensions.width,
    height: image && image.dimensions.height,
    caption: captionedImage.caption && captionedImage.caption.length !== 0 && asHtml(captionedImage.caption),
    alt: image && image.alt,
    title: tasl && tasl.title,
    author: tasl && tasl.author,
    source: {
      name: tasl && tasl.sourceName,
      link: tasl && tasl.sourceLink
    },
    license: tasl && tasl.license,
    copyright: {
      holder: tasl && tasl.copyrightHolder,
      link: tasl && tasl.copyrightLink
    }
  }: Picture);
}

function parseSeries(doc: ?PrismicDocFragment): Series {
  return doc && doc.map(seriesGroup => {
    const series = seriesGroup.series;
    return series && series.data && {
      url: series.id,
      id: series.id,
      name: series.data.name,
      description: asText(series.data.description),
      color: series.data.color,
      commissionedLength: series.data.commissionedLength,
      schedule: series.data.schedule && series.data.schedule.map(comingSoon => {
        // TODO
      })
    };
  }).filter(_ => _);
}

function parseContributors(doc: ?PrismicDocFragment): Array<Contributor> {
  return doc && doc
    .filter(creator => creator.slice_type === 'person')
    .map(slice => {
      const personData = slice.primary.person && slice.primary.person.data;
      const roleData = slice.primary.role && slice.primary.role.data;
      const role = roleData && {
        title: roleData && asText(roleData.title)
      };
      const person = personData && {
        name: personData.name,
        twitterHandle: personData.twitterHandle,
        image: personData.image && personData.image.url,
        description: asText(personData.description)
      };

      return {person, role};
    });
}

function parseImagePromo(doc: ?PrismicDocFragment): ?ImagePromo {
  const maybePromo = doc && doc.find(slice => slice.slice_type === 'editorialImage');
  return maybePromo && ({
    text: asText(maybePromo.primary.caption),
    media: parsePicture({image: maybePromo.primary.image})
  }: ImagePromo);
}

function parsePublishedDate(doc) {
  // We fallback to `Date.now()` in case we're in preview and don't have a published date
  // This is because we need to have a separate `publishDate` for articles imported from WP
  return PrismicDate(doc.data.publishDate || doc.first_publication_date || Date.now());
}

function parseFeaturedMediaFromBody(doc: PrismicDoc): ?Picture {
  return List(doc.data.body.filter(slice => slice.slice_label === 'featured')
    .map(slice => {
      switch (slice.slice_type) {
        case 'editorialImage': return parsePicture(slice.primary);
      }
    })).first();
}

function parseTaslFromCopyright(copyright) {
  // We expect a string of title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink
  // e.g. Self|Rob Bidder|||CC-BY-NC
  try {
    const list = copyright.split('|');
    const v = list
      .concat(Array(7 - list.length))
      .map(v => !v.trim() ? null : v.trim());

    const [title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink] = v;
    return {title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink};
  } catch (e) {
    return copyright;
  }
}

// This purposefully isn't named `parseText` | `parseHtml` to match the prismic API.
export function asText(maybeContent) {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function asHtml(maybeContent) {
  return maybeContent && RichText.asHtml(maybeContent).trim();
}
