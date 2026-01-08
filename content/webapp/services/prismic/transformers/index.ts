import * as prismic from '@prismicio/client';

import { ImageType } from '@weco/common/model/image';
import {
  StandfirstSlice as RawStandfirstSlice,
  WebcomicSeriesDocument as RawWebcomicSeriesDocument,
} from '@weco/common/prismicio-types';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { isNotUndefined, isString } from '@weco/common/utils/type-guards';
import { ArticleFormatId } from '@weco/content/data/content-format-ids';
import { LabelField } from '@weco/content/model/label-field';
import {
  GenericDoc,
  GenericDocWithMetaDescription,
  GenericDocWithPromo,
  RelatedGenericDoc,
  WithArticleFormat,
  WithCardFormat,
  WithEventFormat,
  WithGuideFormat,
  WithPageFormat,
  WithProjectFormat,
} from '@weco/content/services/prismic/types';
import { Format } from '@weco/content/types/format';
import { GenericContentFields } from '@weco/content/types/generic-content-fields';

import { transformImagePromo } from './images';

export function transformFormat(document: {
  data:
    | WithArticleFormat
    | WithCardFormat
    | WithEventFormat
    | WithGuideFormat
    | WithPageFormat
    | WithProjectFormat;
}): Format | undefined {
  const { format } = document.data;

  if (isFilledLinkToDocumentWithData(format) && format.data) {
    const title = Array.isArray(format.data.title)
      ? (format.data.title as prismic.RichTextField)
      : ([] as prismic.RichTextField);
    const description = Array.isArray(format.data.description)
      ? (format.data.description as prismic.RichTextField)
      : undefined;

    return {
      id: format.id,
      title: asTitle(title),
      description: asHtml(description),
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
  /* eslint-disable @typescript-eslint/no-explicit-any */
  format: any
  /* eslint-enable @typescript-eslint/no-explicit-any */
): LabelField {
  if (isFilledLinkToDocumentWithData(format)) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const description = format.data.description as any;
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return {
      id: format.id as ArticleFormatId,
      title: asText(format.data.title as prismic.TitleField),
      description:
        description && prismic.isFilled.richText(description)
          ? (description as prismic.RichTextField)
          : undefined,
    };
  }
  return {};
}

export const isGenericDocWithPromo = (
  doc: GenericDoc | RelatedGenericDoc | RawWebcomicSeriesDocument
): doc is GenericDocWithPromo => {
  return Boolean(doc.data && 'promo' in doc.data);
};

export const isGenericDocWithMetaDescription = (
  doc: GenericDoc | RelatedGenericDoc | RawWebcomicSeriesDocument
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
