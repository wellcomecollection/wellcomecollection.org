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
  isFilledLinkToDocumentWithData,
  isFilledLinkToMediaField,
  isFilledLinkToWebField,
  WithArticleFormat,
} from '../types';
import { InferDataInterface } from '@weco/common/services/prismic/types';
import { GenericContentFields } from '../../../types/generic-content-fields';
import { ImageType } from '@weco/common/model/image';
import { isNotUndefined, isString } from '@weco/common/utils/array';
import { WithGuideFormat } from '../types/guides';
import { WithCardFormat } from '../types/card';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { transformImagePromo } from './images';
import { WithPageFormat } from '../types/pages';
import { WithEventFormat } from '../types/events';
import { Format } from '../../../types/format';
import { LabelField } from '@weco/common/model/label-field';
import { ArticleFormat } from '../types/article-format';
import { ArticleFormatId } from '@weco/common/services/prismic/content-format-ids';
import * as prismicT from '@prismicio/types';
import { transformBody } from './body';

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

export function transformGenericFields(doc: Doc): GenericContentFields {
  const { data } = doc;
  const promo = data.promo && transformImagePromo(data.promo);

  const image: ImageType | undefined =
    data.promo && data.promo.length > 0
      ? data.promo
          .filter((slice: prismicT.Slice) => slice.primary.image)
          .map(({ primary: { image } }) => transformImage(image))
          .find(_ => _) || undefined // just get the first one;
      : undefined;

  const body = data.body ? transformBody(data.body) : [];
  const standfirst = body.find(slice => slice.type === 'standfirst');
  const metadataDescription = asText(data.metadataDescription);

  return {
    id: doc.id,
    title: asTitle(data.title),
    body: body,
    standfirst: standfirst && standfirst.value,
    promo,
    image,
    metadataDescription,
    // we pass an empty array here to be overriden by each content type
    // TODO: find a way to enforce this.
    labels: [],
  };
}
