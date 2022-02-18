import * as prismicH from 'prismic-helpers-beta';
import { PrismicDocument, KeyTextField, RichTextField } from '@prismicio/types';
import { Label } from '@weco/common/model/labels';
import { WithSeries } from '../types/articles';
import linkResolver from '../link-resolver';
import {
  CommonPrismicFields,
  Image,
  isFilledLinkToDocumentWithData,
  WithArticleFormat,
} from '../types';
import type {
  AnyRegularField,
  FilledLinkToDocumentField,
  GroupField,
  RelationField,
  SliceZone,
} from '@prismicio/types';
import { link } from './vendored-helpers';

type Meta = {
  title: string;
  type: 'website' | 'article' | 'book' | 'profile' | 'video' | 'music';
  url: string;
  description?: string;
  promoText?: string;
  image?: Image;
};

type Doc = PrismicDocument<CommonPrismicFields>;

export function transformMeta(doc: Doc): Meta {
  const promo = transformPromo(doc);

  return {
    title: transformRichTextFieldToString(doc.data.title) ?? '',
    type: 'website',
    // We use `||` over `??` as we want empty strigs to revert to undefined
    description: doc.data.metadataDescription || undefined,
    promoText:
      transformRichTextFieldToString(promo?.caption ?? []) || undefined,
    image: promo?.image,
    url: linkResolver(doc) || '',
  };
}

export function transformPromo(doc: Doc) {
  /**
   * this is a little bit annoying as we modelled this at a stage where Prismic was suggesting
   * "use slices for all the things!". Unfortunately it definitely wasn't made for this, and
   * we should have probably just had `.image` and `.description`.
   * We could reimport into these fields, but it would have to be the whole Prismic corpus,
   * and we aren't confident enough that it imports correctly.
   *
   * This method flattens out the `SliceZone` into just a Promo
   */

  // We have to explicitly set undefined here as we don't have the
  // `noUncheckedIndexedAccess` tsconfig compiler option set
  return doc.data?.promo?.[0]?.primary ?? undefined;
}

export function transformLabels(doc: Doc): Label[] {
  const typeLabels = {
    seasons: [{ text: 'Season' }],
  };

  const labels = typeLabels[doc.type];
  return labels ?? [];
}

export function transformSeries(document: PrismicDocument<WithSeries>) {
  return document.data.series
    .map(({ series }) => series)
    .filter(isFilledLinkToDocumentWithData);
}

export function transformFormat(document: PrismicDocument<WithArticleFormat>) {
  const { format } = document.data;

  if (isFilledLinkToDocumentWithData(format) && format.data) {
    return format;
  }
}

// This is to avoid introducing nulls into our codebase
export function transformKeyTextField(field: KeyTextField) {
  return field ?? undefined;
}

// Prismic often returns empty RichText fields as `[]`, this filters them out
export function transformRichTextField(field: RichTextField) {
  return field && field.length > 0 ? field : undefined;
}

// We have to use this annoyingly often as right at the beginning of the project
// we created titles as `RichTextField`s.
export function transformRichTextFieldToString(field: RichTextField) {
  return field && field.length > 0 ? prismicH.asText(field) : undefined;
}

export const isDocumentLink = <
  TypeEnum = string,
  LangEnum = string,
  DataInterface extends Record<
    string,
    AnyRegularField | GroupField | SliceZone
  > = never
>(
  field: RelationField<TypeEnum, LangEnum, DataInterface> | undefined
): field is FilledLinkToDocumentField<TypeEnum, LangEnum, DataInterface> => {
  return Boolean(
    field && link(field) && field.isBroken === false && field.data
  );
};
