// @flow
import {List} from 'immutable';
import {RichText, Date as PrismicDate} from 'prismic-dom';
import type {
  EventTime, UiEvent, Contributor, Team,
  Place, EventFormat, Audience
} from '../content-model/events';
import {parseBody, parseFeaturedBody} from './prismic-body-parser';
import type {ImagePromo} from '../content-model/content-blocks';
import type {Article} from '../model/article';
import type {Picture} from '../model/picture';
import {isEmptyObj} from '../utils/is-empty-obj';
import type {Series} from '../model/series';
import type {LicenseType} from '../model/license';
import {licenseTypeArray} from '../model/license';
import {
  parseContributors as parseContributorsProperly,
  parseImagePromo as parseImagePromoProperly,
  parseCaptionedImage
// $FlowFixMe
} from '../../common/services/prismic/parsers';

// This is just JSON
type PrismicDoc = Object;
// This is because it could be any part of a JSON doc
type PrismicDocFragment = Object | Array<any>;

export function parseEventDoc(doc: PrismicDoc, scheduleDocs?: PrismicDoc): UiEvent {
  const eventSchedule = scheduleDocs && scheduleDocs.results.map(doc => parseEventDoc(doc));
  const promo = parseImagePromo(doc.data.promo);

  const times: Array<EventTime> = doc.data.times.map(date => {
    return ({
      isFullyBooked: Boolean(date.isFullyBooked),
      range: {
        startDateTime: new Date(date.startDateTime),
        endDateTime: new Date(date.endDateTime)
      }
    }: EventTime);
  });

  const format = doc.data.format && parseEventFormat(doc.data.format);

  // matching https://www.eventbrite.co.uk/e/40144900478?aff=efbneb
  const eventbriteIdMatch = isEmptyObj(doc.data.eventbriteEvent) ? null : /\/e\/([0-9]+)/.exec(doc.data.eventbriteEvent.url);
  const identifiers = eventbriteIdMatch ? [{
    identifierScheme: 'eventbrite-id',
    value: eventbriteIdMatch[1]
  }] : [];

  const bookingEnquiryTeam = doc.data.bookingEnquiryTeam.data && ({
    id: doc.data.bookingEnquiryTeam.id,
    title: asText(doc.data.bookingEnquiryTeam.data.title),
    email: doc.data.bookingEnquiryTeam.data.email,
    phone: doc.data.bookingEnquiryTeam.data.phone,
    url: doc.data.bookingEnquiryTeam.data.url
  }: Team);

  const place = (doc.data.place && !isEmptyDocLink(doc.data.place)) ? ({
    id: doc.data.place.id,
    title: asText(doc.data.place.data.title),
    // geolocation, as it stands, can't be fetch via `fetchLinks`
    geolocation: null,
    // geolocation: {
    //   latitude: place.place.data.geolocation.latitude,
    //   longitude: place.place.data.geolocation.longitude
    // },
    level: doc.data.place.data.level,
    capacity: doc.data.place.data.level
  }: Place) : null;

  const interpretations = doc.data.interpretations.map(interpretation => !isEmptyDocLink(interpretation.interpretationType) ? ({
    interpretationType: {
      title: asText(interpretation.interpretationType.data.title),
      abbreviation: asText(interpretation.interpretationType.data.abbreviation),
      description: asHtml(interpretation.interpretationType.data.description),
      primaryDescription: asHtml(interpretation.interpretationType.data.primaryDescription)
    },
    isPrimary: Boolean(interpretation.isPrimary)
  }) : null).filter(_ => _);

  const audiences = doc.data.audiences.map(audience => !isEmptyDocLink(audience.audience) ? ({
    title: asText(audience.audience.data.title),
    description: asText(audience.audience.data.description)
  }) : null).filter(_ => _);

  const series = doc.data.series.map(series => !isEmptyDocLink(series.series) ? ({
    id: series.series.id,
    title: asText(series.series.data.title),
    description: asHtml(series.series.data.description)
  }) : null).filter(_ => _);

  const bookingType = parseEventBookingType(doc);

  const nonEmptyContributors = doc.data.contributors.filter(c => !isEmptyDocLink(c.contributor));
  const contributors = parseContributorsProperly(nonEmptyContributors);

  const cost = doc.data.cost;
  const eventbriteIdScheme = identifiers.find(id => id.identifierScheme === 'eventbrite-id');
  const eventbriteId = eventbriteIdScheme && eventbriteIdScheme.value;
  const isCompletelySoldOut = times.filter(time => !time.isFullyBooked).length === 0;

  const e = ({
    id: doc.id,
    identifiers: identifiers,
    title: asText(doc.data.title),
    format: format,
    isDropIn: Boolean(doc.data.isDropIn), // the value from Prismic could be null || "yes"
    times: times,
    description: asHtml(doc.data.description),
    interpretations: interpretations,
    audiences: audiences,
    bookingEnquiryTeam: bookingEnquiryTeam,
    contributors: contributors,
    promo: promo,
    series: series,
    place: place,
    bookingInformation: asHtml(doc.data.bookingInformation),
    bookingType: bookingType,
    cost: cost,
    schedule: eventSchedule,
    backgroundTexture: doc.data.backgroundTexture.data && doc.data.backgroundTexture.data.image.url,
    eventbriteId,
    isCompletelySoldOut
  }: UiEvent);

  return e;
}

export function parseEventFormat(frag: Object): ?EventFormat {
  return isEmptyDocLink(frag) ? null : {
    id: frag.id,
    title: asText(frag.data.title),
    shortName: asText(frag.data.shortName),
    description: asHtml(frag.data.description)
  };
}

export function parseAudience(frag: Object): ?Audience {
  return isEmptyDocLink(frag) ? null : {
    id: frag.id,
    title: asText(frag.data.title),
    description: asText(frag.data.description)
  };
}

export function parseEventBookingType(eventDoc: Object): ?string {
  return !isEmptyObj(eventDoc.data.eventbriteEvent) ? 'Ticketed'
    : !isEmptyDocLink(eventDoc.data.bookingEnquiryTeam) ? 'Enquire to book'
      : !isEmptyDocLink(eventDoc.data.place) && eventDoc.data.place.data.capacity  ? 'First come, first served'
        : null;
}

export function getPositionInPrismicSeries(seriesId: string, seriesList: PrismicDocFragment): ?number {
  const maybeSeries = seriesList.find((s) => s.series.id === seriesId);
  return maybeSeries && maybeSeries.positionInSeries;
}

export function parseArticleDoc(doc: PrismicDoc): Article {
  // TODO: construct this not from strings
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
  const featuredBodyParts = parseFeaturedBody(doc.data.body);
  const promoElement = parseImagePromoProperly(doc.data.promo);

  const article: Article = {
    contentType: 'article',
    id: doc.id,
    headline: headline,
    url: url,
    datePublished: publishDate,
    thumbnail: thumbnail,
    author: contributors,
    series: series,
    bodyParts: bodyParts,
    mainMedia: [featuredMedia],
    description: description,
    positionInSeries: positionInSeries,
    featuredBodyParts: featuredBodyParts,
    promo: promoElement
  };

  return article;
}

export function parseWebcomicDoc(doc: PrismicDoc): Article {
  // TODO : construct this not from strings
  const url = `/articles/${doc.id}`;

  // TODO: potentially get rid of this
  const publishDate = parsePublishedDate(doc);
  const mainMedia = [parseCaptionedImage({ image: doc.data.image, caption: [] })];

  // TODO: Don't convert this into thumbnail
  const promo = doc.data.promo.find(slice => slice.slice_type === 'editorialImage');
  const thumbnail = promo && parsePicture(promo.primary);
  const description = asText(promo.primary.caption); // TODO: Do not use description
  const contributors = parseContributors(doc.data.contributors);
  const series = parseSeries(doc.data.series);
  const promoElement = parseImagePromoProperly(doc.data.promo);

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
    description: description,
    promo: promoElement
  };

  return article;
}

export function parsePicture(captionedImage: Object, minWidth: ?string = null): Picture {
  const image = isEmptyObj(captionedImage.image) ? null : captionedImage.image;
  const tasl = image && parseTaslFromString(image.copyright);

  return ({
    type: 'picture',
    contentUrl: image && image.url,
    width: image && image.dimensions && image.dimensions.width,
    height: image && image.dimensions && image.dimensions.height,
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

export function prismicImage(prismicImage: Object): Picture { // TODO: wrong typedef
  const image = isEmptyObj(prismicImage) ? null : prismicImage;

  return {
    type: 'picture',
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
      name: series.data.name || asText(series.data.title),
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
        description: asHtml(personData.description)
      };

      return {person, role};
    })) || List();
}

type CropType = '16:9' | '32:15' | 'square';

export function parseImagePromo(doc: ?PrismicDocFragment, cropType: CropType = '16:9', minWidth: ?string = null): ?ImagePromo {
  const maybePromo = doc && doc.find(slice => slice.slice_type === 'editorialImage');
  return maybePromo && ({
    caption: asText(maybePromo.primary.caption),
    image: maybePromo.primary.image.dimensions && parsePicture({
      image:
        // We introduced enforcing 16:9 half way through, so we have to do a check for it.
        maybePromo.primary.image[cropType] || maybePromo.primary.image
    }, minWidth)
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
        case 'editorialImage': return parseCaptionedImage(slice.primary);
        case 'youtubeVideoEmbed': return parseVideo(slice.primary);
      }
    })).first();
}

type Tasl = {|
  title: ?string;
  author: ?string;
  sourceName: ?string;
  sourceLink: ?string;
  license: ?LicenseType;
  copyrightHolder: ?string;
  copyrightLink: ?string;
|}

export function parseTaslFromString(pipedString: string): Tasl {
  // We expect a string of title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink
  // e.g. Self|Rob Bidder|||CC-BY-NC
  try {
    const list = pipedString.split('|');
    const v = list
      .concat(Array(7 - list.length))
      .map(v => !v.trim() ? null : v.trim());

    const [title, author, sourceName, sourceLink, maybeLicense, copyrightHolder, copyrightLink] = v;
    const license: ?LicenseType = licenseTypeArray.find(l => l === maybeLicense);
    return {title, author, sourceName, sourceLink, license, copyrightHolder, copyrightLink};
  } catch (e) {
    return {
      title: pipedString,
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
const linkResolver = (doc) => {
  switch (doc.type) {
    case 'articles'      : return `/articles/${doc.id}`;
    case 'webcomics'     : return `/articles/${doc.id}`;
    case 'exhibitions'   : return `/exhibitions/${doc.id}`;
    case 'events'        : return `/events/${doc.id}`;
    case 'series'        : return `/series/${doc.id}`;
    case 'installations' : return `/installations/${doc.id}`;
    case 'pages'         : return `/pages/${doc.id}`;
    case 'books'         : return `/books/${doc.id}`;
  }
};

export function asText(maybeContent: any) {
  return maybeContent && RichText.asText(maybeContent, linkResolver).trim();
}

export function asHtml(maybeContent: any) {
  // Prismic can send us empty html elements which can lead to unwanted UI in templates.
  // Check that `asText` wouldn't return an empty string.
  const isEmpty = !maybeContent || (asText(maybeContent) || '').trim() === '';
  return isEmpty ? null : RichText.asHtml(maybeContent, linkResolver).trim();
}

export function isEmptyDocLink(fragment: Object) {
  return fragment.link_type === 'Document' && !fragment.data;
}

// This is used for when we have a "single" `StructuredText` and want to maintain the inline HTML
// (`a`, `em` etc) but would rather Prismic not wrap it in a `p` for us.
// The empty `class` attribute 🤷‍
export function deP(text: ?string) {
  return text && text.replace(/<\/?p( class="")?>/g, '');
}
