import * as prismic from '@prismicio/client';
import { CommonPrismicFields, WithArticleFormat } from '../types';
import {
  InferDataInterface,
  isFilledLinkToDocumentWithData,
} from '@weco/common/services/prismic/types';
import { GenericContentFields } from '../../../types/generic-content-fields';
import { ImageType } from '@weco/common/model/image';
import { isNotUndefined, isString } from '@weco/common/utils/type-guards';
import { WithGuideFormat } from '../types/guides';
import { WithCardFormat } from '../types/card';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { transformImagePromo } from './images';
import { WithPageFormat } from '../types/pages';
import { WithEventFormat } from '../types/events';
import { Format } from '../../../types/format';
import { LabelField } from '@weco/content/model/label-field';
import { ArticleFormat } from '../types/article-format';
import { ArticleFormatId } from '@weco/content/data/content-format-ids';

import { transformBody } from './body';
import { isStandfirst } from '../../../types/body';

type Doc = prismic.PrismicDocument<CommonPrismicFields>;

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
  format: prismic.FilledContentRelationshipField<
    'article-formats',
    'en-gb',
    InferDataInterface<ArticleFormat>
  > & { data: InferDataInterface<ArticleFormat> }
): LabelField {
  return {
    id: format.id as ArticleFormatId,
    title: asText(format.data.title),
    description: format.data.description ? format.data.description : undefined,
  };
}

export function transformGenericFields(doc: Doc): GenericContentFields {
  const { data } = doc;
  const promo = data.promo && transformImagePromo(data.promo);

  const primaryPromo =
    data.promo && data.promo.length > 0
      ? data.promo
          .filter((slice: prismic.Slice) => slice.primary.image)
          .find(_ => _)
      : undefined;

  const image: ImageType | undefined = primaryPromo
    ? transformImage(primaryPromo.primary.image)
    : undefined;

  const body = data.body ? transformBody(data.body) : [];
  const untransformedBody = data.body || [];
  const standfirst = body.find(isStandfirst);
  const untransformedStandfirst = untransformedBody.find(
    (slice: prismic.Slice) => slice.slice_type === 'standfirst'
  );
  const metadataDescription = asText(data.metadataDescription);

  return {
    id: doc.id,
    title: asTitle(data.title),
    body,
    untransformedBody,
    standfirst: standfirst?.value,
    untransformedStandfirst,
    promo,
    image,
    metadataDescription,
    // we pass an empty array here to be overriden by each content type
    // TODO: find a way to enforce this.
    labels: [],
  };
}
