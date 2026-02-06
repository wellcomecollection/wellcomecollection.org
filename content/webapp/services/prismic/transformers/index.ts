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
  PromoSliceZone,
  RelatedGenericDoc,
  WithFormat,
} from '@weco/content/services/prismic/types';
import { Format } from '@weco/content/types/format';
import { GenericContentFields } from '@weco/content/types/generic-content-fields';

import { transformImagePromo } from './images';

export function transformFormat(document: {
  data: WithFormat;
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

/**
 * Build the shared "generic" content fields from a Prismic relationship field.
 *
 * Why this exists:
 * - Prismic content relationships are not full documents at runtime (even when
 *   they have `data` via `fetchLinks`/GraphQuery), so using `transformGenericFields`
 *   would require unsafe casts like `relationship as RawXDocument`.
 * - This helper lets us safely use the subset of fields we expect to be present
 *   on relationship `data` (e.g. title/body/promo) without pretending we have a
 *   complete Prismic document.
 */
export function transformGenericFieldsFromRelationship(field: {
  id: string;
  data: Record<string, unknown>;
}): GenericContentFields {
  const { data } = field;

  // Helper to check if an unknown value is an editorial image slice with the expected structure
  const isEditorialImageSlice = (
    slice: unknown
  ): slice is prismic.Slice<
    'editorialImage',
    { image?: prismic.ImageField }
  > => {
    return (
      slice !== null &&
      typeof slice === 'object' &&
      'slice_type' in slice &&
      (slice as { slice_type: string }).slice_type === 'editorialImage'
    );
  };

  // Only process promo if it exists in the fetched data
  // (not all relationships include promo in fetchLinks)
  const promoSlices =
    Array.isArray(data.promo) && data.promo.length > 0
      ? (data.promo as unknown[]).filter(isEditorialImageSlice)
      : [];

  const promo =
    promoSlices.length > 0
      ? transformImagePromo(promoSlices as unknown as PromoSliceZone)
      : undefined;

  // We keep `image` alongside `promo` for existing consumers.
  const primaryPromo = promoSlices.find(slice => {
    return Boolean(slice.primary?.image);
  });
  const maybeImage = primaryPromo?.primary?.image;
  const image: ImageType | undefined = transformImage(
    maybeImage as
      | prismic.EmptyImageFieldImage
      | prismic.FilledImageFieldImage
      | undefined
  );

  // Only process body if it exists in the fetched data
  // (not all relationships include body in fetchLinks)
  const untransformedBody =
    Array.isArray(data.body) && data.body.length > 0
      ? (data.body as prismic.Slice[])
      : ([] as prismic.Slice[]);

  const untransformedStandfirst =
    untransformedBody.length > 0
      ? (untransformedBody.find(
          (slice: prismic.Slice) => slice.slice_type === 'standfirst'
        ) as RawStandfirstSlice | undefined)
      : undefined;

  const metadataDescription =
    Array.isArray(data.metadataDescription) ||
    isString(data.metadataDescription)
      ? asText(data.metadataDescription as prismic.RichTextField)
      : undefined;

  return {
    id: field.id,
    title:
      Array.isArray(data.title) && isNotUndefined(data.title)
        ? asTitle(data.title as prismic.RichTextField)
        : '',
    untransformedBody,
    untransformedStandfirst,
    promo,
    image,
    metadataDescription,
    labels: [],
  };
}

export function transformSingleLevelGroup(
  frag: Record<string, unknown>[] | null | undefined,
  singlePropertyName: string
): unknown[] {
  return (frag ?? []).reduce<unknown[]>((acc, fragItem) => {
    const field = fragItem[singlePropertyName] as
      | prismic.ContentRelationshipField<string, string, unknown>
      | undefined;

    if (isFilledLinkToDocumentWithData(field)) {
      acc.push(field);
    }

    return acc;
  }, []);
}

export function transformLabelType(
  format: prismic.ContentRelationshipField<string, string, unknown> | undefined
): LabelField {
  if (isFilledLinkToDocumentWithData(format)) {
    const titleField = (format.data as Record<string, unknown>).title;
    const descriptionField = (format.data as Record<string, unknown>)
      .description;
    return {
      id: format.id as ArticleFormatId,
      title: asText(titleField as prismic.TitleField),
      description:
        descriptionField &&
        prismic.isFilled.richText(descriptionField as prismic.RichTextField)
          ? (descriptionField as prismic.RichTextField)
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
