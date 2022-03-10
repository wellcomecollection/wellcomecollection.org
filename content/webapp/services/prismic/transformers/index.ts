import * as prismicH from '@prismicio/helpers';
import {
  PrismicDocument,
  FilledLinkToDocumentField,
  KeyTextField,
  LinkField,
  RichTextField,
  TimestampField,
} from '@prismicio/types';
import linkResolver from '../link-resolver';
import {
  CommonPrismicFields,
  InferDataInterface,
  isFilledLinkToDocumentWithData,
  isFilledLinkToMediaField,
  isFilledLinkToWebField,
  WithArticleFormat,
} from '../types';
import {
  BodyType,
  GenericContentFields,
} from '../../../types/generic-content-fields';
import { transformCollectionVenue } from '@weco/common/services/prismic/transformers/collection-venues';
import { ImageType } from '@weco/common/model/image';
import { Body } from '../types/body';
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { transformPage } from './pages';
import { transformGuide } from './guides';
import { transformEventSeries } from './event-series';
import { transformExhibition } from './exhibitions';
import { transformArticle } from './articles';
import { transformEvent } from './events';
import { transformSeason } from './seasons';
import { transformCard } from './card';
import { MultiContentPrismicDocument } from '../types/multi-content';
import { GuidePrismicDocument, WithGuideFormat } from '../types/guides';
import { SeasonPrismicDocument } from '../types/seasons';
import { CardPrismicDocument, WithCardFormat } from '../types/card';
import {
  getWeight,
  transformCollectionVenueSlice,
  transformContactSlice,
  transformContentListSlice,
  transformDeprecatedImageListSlice,
  transformDiscussionSlice,
  transformEditorialImageGallerySlice,
  transformEditorialImageSlice,
  transformEmbedSlice,
  transformGifVideoSlice,
  transformIframeSlice,
  transformInfoBlockSlice,
  transformMapSlice,
  transformMediaObjectListSlice,
  transformQuoteSlice,
  transformSearchResultsSlice,
  transformStandfirstSlice,
  transformTableSlice,
  transformTagListSlice,
  transformTextSlice,
  transformTitledTextListSlice,
} from './body';
import { transformImage, transformImagePromo } from './images';
import { Tasl } from '@weco/common/model/tasl';
import { licenseTypeArray } from '@weco/common/model/license';
import { WithPageFormat } from '../types/pages';
import { WithEventFormat } from '../types/events';
import { Format } from '../../../types/format';
import { LabelField } from '@weco/common/model/label-field';
import { ArticleFormat } from '../types/article-format';
import { ArticleFormatId } from '@weco/common/services/prismic/content-format-ids';
import * as prismicT from '@prismicio/types';

type Doc = PrismicDocument<CommonPrismicFields>;

export function transformFormat(document: {
  data:
    | WithArticleFormat
    | WithCardFormat
    | WithEventFormat
    | WithGuideFormat
    | WithPageFormat;
}): Format | undefined {
  const { format } = document.data;

  if (isFilledLinkToDocumentWithData(format) && format.data) {
    return {
      id: format.id,
      title: asTitle(format.data.title),
      description: asHtml(format.data.description),
    };
  }
}

export function transformTimestamp(field: TimestampField): Date | undefined {
  return prismicH.asDate(field) || undefined;
}

// Prismic often returns empty RichText fields as `[]`, this filters them out

/** Here we have wrappers for `KeyTextField` and `RichTextField`.
 *
 * We prefer these to the versions provided by the prismic-helpers library because
 * they add extra validation steps, e.g. removing stray whitespace or null values.
 */
export function asText(
  field: KeyTextField | RichTextField
): string | undefined {
  if (isString(field)) {
    // KeyTextField
    return field.trim().length > 0 ? field.trim() : undefined;
  } else {
    // RichTextField
    const output =
      field && field.length > 0 ? prismicH.asText(field).trim() : undefined;
    return output && output.length > 0 ? output : undefined;
  }
}

// Prismic adds `[ { type: 'paragraph', text: '', spans: [] } ]` when you
// insert text, then remove it, so we check for that and remove it.
function nonEmpty(field?: RichTextField): field is RichTextField {
  return isNotUndefined(field) && (asText(field) || '').trim() !== '';
}

export function asRichText(field: RichTextField): RichTextField | undefined {
  return nonEmpty(field) ? field : undefined;
}

export function asHtml(field?: RichTextField): string | undefined {
  return nonEmpty(field) ? prismicH.asHTML(field).trim() : undefined;
}

export function asTitle(title: RichTextField): string {
  // We always need a title - blunt validation, but validation none the less
  return asText(title) || '';
}

export function transformLink(
  link?: LinkField<string, string, any>
): string | undefined {
  if (link) {
    if (isFilledLinkToWebField(link) || isFilledLinkToMediaField(link)) {
      return link.url;
    } else if (isFilledLinkToDocumentWithData(link)) {
      return linkResolver({ id: link.id, type: link.type });
    }
  }
}

export function transformSingleLevelGroup(
  frag: Record<string, any>[],
  singlePropertyName: string
) {
  return (frag || [])
    .filter(fragItem =>
      isFilledLinkToDocumentWithData(fragItem[singlePropertyName])
    )
    .map<Record<string, any>>(fragItem => fragItem[singlePropertyName]);
}

export function transformLabelType(
  format: FilledLinkToDocumentField<
    'article-formats',
    'en-gb',
    InferDataInterface<ArticleFormat>
  > & { data: InferDataInterface<ArticleFormat> }
): LabelField {
  return {
    id: format.id as ArticleFormatId,
    title: asText(format.data.title),
    description: format.data.description ? format.data.description : [],
  };
}

type PromoImage = {
  image?: ImageType;
  squareImage?: ImageType;
  widescreenImage?: ImageType;
  superWidescreenImage?: ImageType;
};

export function transformBody(body: Body): BodyType {
  return body
    .map(slice => {
      switch (slice.slice_type) {
        case 'standfirst':
          return transformStandfirstSlice(slice);

        case 'text':
          return transformTextSlice(slice);

        case 'map':
          return transformMapSlice(slice);

        case 'editorialImage':
          return transformEditorialImageSlice(slice);

        case 'editorialImageGallery':
          return transformEditorialImageGallerySlice(slice);

        case 'titledTextList':
          return transformTitledTextListSlice(slice);

        case 'contentList':
          return transformContentListSlice(slice);

        case 'collectionVenue':
          return transformCollectionVenueSlice(slice);

        case 'searchResults':
          return transformSearchResultsSlice(slice);

        case 'quote':
        case 'quoteV2':
          return transformQuoteSlice(slice);

        case 'iframe':
          return transformIframeSlice(slice);

        case 'gifVideo':
          return transformGifVideoSlice(slice);

        case 'contact':
          return transformContactSlice(slice);

        case 'embed':
          return transformEmbedSlice(slice);

        case 'table':
          return transformTableSlice(slice);

        case 'infoBlock':
          return transformInfoBlockSlice(slice);

        case 'discussion':
          return transformDiscussionSlice(slice);

        case 'tagList':
          return transformTagListSlice(slice);

        // Deprecated
        case 'imageList':
          return transformDeprecatedImageListSlice(slice);

        case 'mediaObjectList':
          return transformMediaObjectListSlice(slice);
      }
    })
    .filter(isNotUndefined);
}

export function transformGenericFields(doc: Doc): GenericContentFields {
  const { data } = doc;
  const promo = data.promo && transformImagePromo(data.promo);

  const promoImage: PromoImage =
    data.promo && data.promo.length > 0
      ? data.promo
          .filter((slice: prismicT.Slice) => slice.primary.image)
          .map(({ primary: { image } }) => {
            return {
              image: transformImage(image),
              squareImage: transformImage(image.square),
              widescreenImage: transformImage(image['16:9']),
              superWidescreenImage: transformImage(image['32:15']),
            };
          })
          .find(_ => _) || {} // just get the first one;
      : {};

  const { image, squareImage, widescreenImage, superWidescreenImage } =
    promoImage;
  const body = data.body ? transformBody(data.body) : [];
  const standfirst = body.find(slice => slice.type === 'standfirst');
  const metadataDescription = asText(data.metadataDescription);

  return {
    id: doc.id,
    title: asTitle(data.title),
    body: body,
    standfirst: standfirst && standfirst.value,
    promo: promo,
    promoText: promo && promo.caption,
    promoImage: promo && promo.image,
    image,
    squareImage,
    widescreenImage,
    superWidescreenImage,
    metadataDescription,
    // we pass an empty array here to be overriden by each content type
    // TODO: find a way to enforce this.
    labels: [],
  };
}

export function transformTaslFromString(pipedString: string | null): Tasl {
  if (pipedString === null) {
    return { title: '' };
  }

  // We expect a string of title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink
  // e.g. Self|Rob Bidder|||CC-BY-NC
  try {
    const list = (pipedString || '').split('|');
    const v = list
      .concat(Array(7 - list.length))
      .map(v => (!v.trim() ? undefined : v.trim()));

    const [
      title,
      author,
      sourceName,
      sourceLink,
      maybeLicense,
      copyrightHolder,
      copyrightLink,
    ] = v;
    const license = licenseTypeArray.find(l => l === maybeLicense);
    return {
      title,
      author,
      sourceName,
      sourceLink,
      license,
      copyrightHolder,
      copyrightLink,
    };
  } catch (e) {
    return {
      title: pipedString,
    };
  }
}
