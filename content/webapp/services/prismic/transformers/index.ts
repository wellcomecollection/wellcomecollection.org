import * as prismic from '@prismicio/client';
import {
  WithArticleFormat,
  WithPageFormat,
  WithEventFormat,
  WithCardFormat,
  WithGuideFormat,
  GenericDoc,
  GenericDocWithPromo,
  GenericDocWithMetaDescription,
  RelatedGenericDoc,
} from '@weco/content/services/prismic/types';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import {
  StandfirstSlice as RawStandfirstSlice,
  ArticlesDocumentData as RawArticlesDocumentData,
  WebcomicsDocumentData as RawWebcomicsDocumentData,
} from '@weco/common/prismicio-types';
import { GenericContentFields } from '@weco/content/types/generic-content-fields';
import { ImageType } from '@weco/common/model/image';
import { isNotUndefined, isString } from '@weco/common/utils/type-guards';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { transformImagePromo } from './images';
import { Format } from '@weco/content/types/format';
import { LabelField } from '@weco/content/model/label-field';
import { ArticleFormatId } from '@weco/content/data/content-format-ids';

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

// Prismic often returns empty RichText fields as `[]`, this filters them out

/** Here we have wrappers for `KeyTextField` and `RichTextField`.
 *
 * We prefer these to the versions provided by the prismic-helpers library because
 * they add extra validation steps, e.g. removing stray whitespace or null values.
 */
export function asText(
  field: prismic.KeyTextField | prismic.RichTextField
): string | undefined {
  if (isString(field)) {
    // prismic.KeyTextField
    return field.trim().length > 0 ? field.trim() : undefined;
  } else {
    // prismic.RichTextField
    const output =
      field && field.length > 0 ? prismic.asText(field).trim() : undefined;
    return output && output.length > 0 ? output : undefined;
  }
}

// Prismic adds `[ { type: 'paragraph', text: '', spans: [] } ]` when you
// insert text, then remove it, so we check for that and remove it.
function nonEmpty(
  field?: prismic.RichTextField
): field is prismic.RichTextField {
  return isNotUndefined(field) && (asText(field) || '').trim() !== '';
}

export function asRichText(
  field: prismic.RichTextField
): prismic.RichTextField | undefined {
  return nonEmpty(field) ? field : undefined;
}

export function asHtml(field?: prismic.RichTextField): string | undefined {
  return nonEmpty(field) ? prismic.asHTML(field).trim() : undefined;
}

export function asTitle(title: prismic.RichTextField): string {
  // We always need a title - blunt validation, but validation none the less
  return asText(title) || '';
}

export function transformSingleLevelGroup(
  /* eslint-disable @typescript-eslint/no-explicit-any */
  frag: Record<string, any>[],
  /* eslint-enable @typescript-eslint/no-explicit-any */
  singlePropertyName: string
) {
  return (
    (frag || [])
      .filter(fragItem =>
        isFilledLinkToDocumentWithData(fragItem[singlePropertyName])
      )
      /* eslint-disable @typescript-eslint/no-explicit-any */
      .map<Record<string, any>>(fragItem => fragItem[singlePropertyName])
  );
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export function transformLabelType(
  format: RawArticlesDocumentData['format'] | RawWebcomicsDocumentData['format']
): LabelField {
  if (isFilledLinkToDocumentWithData(format)) {
    return {
      id: format.id as ArticleFormatId,
      title: asText(format.data.title as prismic.TitleField),
      description: format.data.description
        ? (format.data.description as prismic.RichTextField)
        : undefined,
    };
  }
  return {};
}

const isGenericDocWithPromo = (
  doc: GenericDoc | RelatedGenericDoc
): doc is GenericDocWithPromo => {
  return Boolean(doc.data && 'promo' in doc.data);
};

const isGenericDocWithMetaDescription = (
  doc: GenericDoc | RelatedGenericDoc
): doc is GenericDocWithMetaDescription => {
  return Boolean(doc.data && 'metaDescription' in doc.data);
};

export function transformGenericFields(
  doc: GenericDoc | RelatedGenericDoc
): GenericContentFields {
  const { data } = doc;
  const promo = isGenericDocWithPromo(doc)
    ? transformImagePromo(doc.data.promo)
    : undefined;

  const primaryPromo =
    isGenericDocWithPromo(doc) && doc.data.promo.length > 0
      ? doc.data.promo
          .filter((slice: prismic.Slice) => slice.primary.image)
          .find(_ => _)
      : undefined;

  const image: ImageType | undefined = primaryPromo
    ? transformImage(primaryPromo.primary.image)
    : undefined;

  const untransformedBody = data?.body || [];
  const untransformedStandfirst = untransformedBody.find(
    (slice: prismic.Slice) => slice.slice_type === 'standfirst'
  ) as RawStandfirstSlice | undefined;
  const metadataDescription = isGenericDocWithMetaDescription(doc)
    ? asText(doc.data.metadataDescription)
    : undefined;

  return {
    id: doc.id,
    title: data?.title ? asTitle(data.title) : '',
    untransformedBody,
    untransformedStandfirst,
    promo,
    image,
    metadataDescription,
    // we pass an empty array here to be overriden by each content type
    // TODO: find a way to enforce this.
    labels: [],
  };
}
