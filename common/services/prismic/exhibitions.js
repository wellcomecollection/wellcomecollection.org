// $FlowFixMe (ts)
import { breakpoints } from '../../utils/breakpoints';
import {
  parseTitle,
  parseImagePromo,
  parseTimestamp,
  parsePlace,
  parsePromoToCaptionedImage,
  isDocumentLink,
  asText,
  asHtml,
  parseGenericFields,
  parseBoolean,
  parseSingleLevelGroup,
  isEmptyHtmlString,
} from './parsers';
// $FlowFixMe (tsx)
import { parseSeason } from './seasons';
// $FlowFixMe
import type { Resource } from '../../model/resource';
import type { PrismicFragment, PrismicDocument } from './types';
import type {
  UiExhibition,
  UiExhibit,
  ExhibitionFormat,
} from '../../model/exhibitions';

export function parseResourceTypeList(
  fragment: PrismicFragment[],
  labelKey: string
): Resource[] {
  return fragment
    .map(label => label[labelKey])
    .filter(Boolean)
    .filter(label => label.isBroken === false)
    .map(label => parseResourceType(label.data));
}

function parseResourceType(fragment: PrismicFragment): Resource {
  return {
    id: fragment.id,
    title: asText(fragment.title),
    description: fragment.description,
    icon: fragment.icon,
  };
}

export function parseExhibitionFormat(frag: Object): ?ExhibitionFormat {
  return isDocumentLink(frag)
    ? {
        id: frag.id,
        title: (frag.data && asText(frag.data.title)) || '',
        description: frag.data && asHtml(frag.data.description),
      }
    : undefined;
}

export function parseExhibits(document: PrismicFragment[]): UiExhibit[] {
  return document
    .map(exhibit => {
      if (exhibit.item.type === 'exhibitions' && !exhibit.item.isBroken) {
        return {
          exhibitType: 'exhibitions',
          item: parseExhibitionDoc(exhibit.item),
        };
      }
    })
    .filter(Boolean);
}

export function parseExhibitionDoc(document: PrismicDocument): UiExhibition {
  const genericFields = parseGenericFields(document);
  const data = document.data;
  const promo = data.promo;
  const exhibits = data.exhibits ? data.exhibits.map(i => i.item.id) : [];
  const events = data.events ? data.events.map(i => i.item.id) : [];
  const articles = data.articles ? data.articles.map(i => i.item.id) : [];
  const books = data.books ? data.books.map(i => i.item.id) : [];
  const pages = data.pages ? data.pages.map(i => i.item.id) : [];
  const relatedIds = [
    ...exhibits,
    ...events,
    ...articles,
    ...books,
    ...pages,
  ].filter(Boolean);
  const promoThin =
    promo && parseImagePromo(promo, '32:15', breakpoints.medium);
  const promoSquare =
    promo && parseImagePromo(promo, 'square', breakpoints.small);

  const promos = [promoThin, promoSquare]
    .filter(Boolean)
    .map(p => p.image)
    .filter(Boolean);

  const id = document.id;
  const format = data.format && parseExhibitionFormat(data.format);
  const url = `/exhibitions/${id}`;
  const title = parseTitle(data.title);
  const start = parseTimestamp(data.start);
  const end = data.end && parseTimestamp(data.end);
  const statusOverride = asText(data.statusOverride);
  const bslInfo = isEmptyHtmlString(data.bslInfo) ? undefined : data.bslInfo;
  const audioDescriptionInfo = isEmptyHtmlString(data.audioDescriptionInfo)
    ? undefined
    : data.audioDescriptionInfo;
  const promoImage =
    promo && promo.length > 0
      ? parsePromoToCaptionedImage(data.promo)
      : undefined;

  const seasons = parseSingleLevelGroup(data.seasons, 'season').map(season => {
    return parseSeason(season);
  });

  const exhibition = {
    ...genericFields,
    type: 'exhibitions',
    shortTitle: data.shortTitle && asText(data.shortTitle),
    format: format,
    start: start,
    end: end,
    isPermanent: parseBoolean(data.isPermanent),
    statusOverride: statusOverride,
    bslInfo: bslInfo,
    audioDescriptionInfo: audioDescriptionInfo,
    place: isDocumentLink(data.place) ? parsePlace(data.place) : undefined,
    exhibits: data.exhibits ? parseExhibits(data.exhibits) : [],
    promo: promoImage && {
      id,
      format,
      url,
      title,
      shortTitle: data.shortTitle && asText(data.shortTitle),
      image: promoImage && promoImage.image,
      squareImage: promoSquare && promoSquare.image,
      start,
      end,
      statusOverride,
    },
    featuredImageList: promos,
    resources: Array.isArray(data.resources)
      ? parseResourceTypeList(data.resources, 'resource')
      : [],
    relatedIds,
    seasons,
    prismicDocument: document,
  };

  const labels = exhibition.isPermanent
    ? [
        {
          text: 'Permanent exhibition',
        },
      ]
    : exhibition.format
    ? [
        {
          text: exhibition.format.title,
        },
      ]
    : [{ text: 'Exhibition' }];

  return { ...exhibition, labels };
}
