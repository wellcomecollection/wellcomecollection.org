// @flow
import {List} from 'immutable';
import {RichText, Date as PrismicDate} from 'prismic-dom';
import type {Exhibition} from '../content-model/exhibition';
import type {
  DateTimeRange, Event, EventFormat, Contributor, EventBookingEnquiryTeam,
  EventLocation
} from '../content-model/events';
import getBreakpoint from '../filters/get-breakpoint';
import {parseBody} from './prismic-body-parser';
import type {ImagePromo} from '../content-model/content-blocks';
import type {Article} from '../model/article';
import type {Promo} from '../model/promo';
import type {Picture} from '../model/picture';
import {isEmptyObj} from '../utils/is-empty-obj';
import type {Series} from '../model/series';
import type {LicenseType} from '../model/license';

// This is just JSON
type PrismicDoc = Object;
// This is because it could be any part of a JSON doc
type PrismicDocFragment = Object | Array<any>;

export function parseEventDoc(doc: PrismicDoc): Event {
  const contributors: Array<Contributor> = parseContributors(doc.data.contributors).toArray();
  const promo = parseImagePromo(doc.data.promo);

  const times: Array<DateTimeRange> = doc.data.times.map(date => {
    return ({
      startDateTime: new Date(date.startDateTime),
      endDateTime: new Date(date.endDateTime)
    }: DateTimeRange);
  });

  const bookingEnquiryTeam = doc.data.bookingEnquiryTeam.data && ({
    id: doc.data.bookingEnquiryTeam.id,
    title: asText(doc.data.bookingEnquiryTeam.data.title),
    email: doc.data.bookingEnquiryTeam.data.email,
    phone: doc.data.bookingEnquiryTeam.data.phone,
    url: doc.data.bookingEnquiryTeam.data.url
  }: EventBookingEnquiryTeam);

  const locations = doc.data.locations.map(location => {
    return ({
      title: asText(location.location.data.title),
      geolocation: location.location.data.geolocation,
      level: location.location.data.level
    }: EventLocation);
  });

  const e = ({
    id: doc.id,
    title: asText(doc.data.title),
    format: doc.data.format.data && ({
      id: doc.data.format.id,
      title: asText(doc.data.format.data.title)
    }: EventFormat),
    times: times,
    description: asHtml(doc.data.description),
    accessOptions: doc.data.accessOptions.map(ao => !isEmptyDocLink(ao.accessOption) ? ({
      accessOption: { title: asText(ao.accessOption.data.title), acronym: ao.accessOption.data.acronym }
    }) : null).filter(_ => _),
    bookingEnquiryTeam: bookingEnquiryTeam,
    contributors: contributors,
    promo: promo,
    series: [],
    locations: locations
  }: Event);

  return e;
}

export function parseExhibitionsDoc(doc: PrismicDoc): Exhibition {
  const featuredImageMobileCrop = parsePicture({image: doc.data.featuredImageMobileCrop});
  const featuredImageMobileCropWithBreakpoint = featuredImageMobileCrop.contentUrl && Object.assign({}, featuredImageMobileCrop, {minWidth: getBreakpoint('small')});
  const promo = parseImagePromo(doc.data.promo);

  const featuredImage = doc.data.featuredImage && parsePicture({ image: doc.data.featuredImage });
  const thinVideoImage = featuredImage && parsePicture({image: doc.data.featuredImage['32:15']}, getBreakpoint('medium'));
  const squareImage = featuredImage && parsePicture({image: doc.data.featuredImage.square}, getBreakpoint('small'));
  const featuredImages = List([
    thinVideoImage,
    // we use the "creative" crop first, but it seems that people would rather have it automatically.
    featuredImageMobileCropWithBreakpoint || squareImage
  ]).filter(_ => _);

  const exhibition = ({
    id: doc.id,
    title: asText(doc.data.title),
    subtitle: asText(doc.data.subtitle),
    start: doc.data.start,
    end: doc.data.end,
    featuredImages: featuredImages,
    featuredImage: featuredImages.first(),
    intro: asText(doc.data.intro),
    description: asHtml(doc.data.description),
    promo: promo,
    body: parseBody(doc.data.body)
  }: Exhibition);

  return exhibition;
}

export function getPositionInPrismicSeries(seriesId: string, seriesList: PrismicDocFragment): ?number {
  const maybeSeries = seriesList.find((s) => s.series.id === seriesId);
  return maybeSeries && maybeSeries.positionInSeries;
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
  const headline = asText(doc.data.title);
  // TODO: The whole scheduled content has some work to be getting on with
  const seriesWithCommissionedLength = series.find(series => series.commissionedLength);
  const positionInSeries = seriesWithCommissionedLength && getPositionInPrismicSeries(series[0].id, doc.data.series) || null;

  const article: Article = {
    contentType: 'article',
    headline: headline,
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

export function parsePromoListItem(item: Object): Promo {
  return ({
    contentType: item.type,
    url: item.link.url,
    title: asText(item.title),
    description: asText(item.description),
    image: parsePicture(item)
  } : Promo);
}

export function parsePicture(captionedImage: Object, minWidth: ?string = null): Picture {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const tasl = image && parseTaslFromCopyright(image.copyright);

  return ({
    type: 'picture',
    contentUrl: image && image.url,
    width: image && image.dimensions.width,
    height: image && image.dimensions.height,
    caption: captionedImage.caption && asHtml(captionedImage.caption),
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
    },
    minWidth
  }: Picture);
}

export function parseVideo(videoSlice: Object) {
  const embedUrl = videoSlice.embed.html.match(/src="([-a-zA-Z0-9://.]+)?/)[1];
  return {
    type: 'video-embed',
    embedUrl: embedUrl
  };
}

export function prismicImage(prismicImage: Object) { // TODO: wrong typedef
  const image = isEmptyObj(prismicImage) ? null : prismicImage;

  return {
    width: image && image.dimensions.width,
    height: image && image.dimensions.height,
    alt: image && image.alt,
    contentUrl: image && image.url
  };
}

function parseSeries(doc: ?PrismicDocFragment): Array<Series> {
  return doc && doc.map(seriesGroup => {
    const series = seriesGroup.series;
    return series && series.data && {
      id: series.id,
      url: series.id,
      name: series.data.name,
      description: asText(series.data.description),
      color: series.data.color,
      commissionedLength: series.data.commissionedLength,
      total: 0,
      items: List()
    };
  }).filter(_ => _) || [];
}

function parseContributors(doc: ?PrismicDocFragment): List<Contributor> {
  return doc && List(doc
    .filter(creator => creator.slice_type === 'person')
    .map(slice => {
      const personData = slice.primary.person && slice.primary.person.data;
      const roleData = slice.primary.role && slice.primary.role.data;
      const role = roleData && {
        id: slice.primary.role.id,
        title: roleData && asText(roleData.title)
      };
      const person = personData && {
        id: slice.primary.person.id,
        name: personData.name,
        twitterHandle: personData.twitterHandle,
        image: personData.image && personData.image.url,
        description: asText(personData.description)
      };

      return {person, role};
    })) || List();
}

export function parseImagePromo(doc: ?PrismicDocFragment): ?ImagePromo {
  const maybePromo = doc && doc.find(slice => slice.slice_type === 'editorialImage');
  return maybePromo && ({
    caption: asText(maybePromo.primary.caption),
    image: parsePicture({
      image:
        // We introduced enforcing 16:9 half way through, so we have to do a check for it.
        maybePromo.primary.image['16:9'] || maybePromo.primary.image
    })
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
        case 'youtubeVideoEmbed': return parseVideo(slice.primary);
      }
    })).first();
}

type Tasl = {|
  title: string;
  author: ?string;
  sourceName: ?string;
  sourceLink: ?string;
  license: ?LicenseType;
  copyrightHolder: ?string;
  copyrightLink: ?string;
|}
function parseTaslFromCopyright(copyright): Tasl {
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
    return {
      title: copyright,
      author: null,
      sourceName: null,
      sourceLink: null,
      license: null,
      copyrightHolder: null,
      copyrightLink: null
    };
  }
}

// This purposefully isn't named `parseText` | `parseHtml` to match the prismic API.
export function asText(maybeContent: any) {
  return maybeContent && RichText.asText(maybeContent).trim();
}

export function asHtml(maybeContent: any) {
  // Prismic can send us empty html elements which can lead to unwanted UI in templates.
  // Check that `asText` wouldn't return an empty string.
  const isEmpty = maybeContent && asText(maybeContent).trim() === '';

  return isEmpty ? null : RichText.asHtml(maybeContent).trim();
}

function isEmptyDocLink(fragment) {
  return fragment.link_type === 'Document' && !fragment.data;
}
