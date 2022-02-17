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
import {
  asText,
  checkAndParseImage,
  parseBody,
  parseImagePromo,
  parseTitle,
} from '@weco/common/services/prismic/parsers';
import { GenericContentFields } from '@weco/common/model/generic-content-fields';
import { ImageType } from '@weco/common/model/image';

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
   * we should have robably just had `.image` and `.description`.
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
export function transformKeyTextField(
  field: KeyTextField
): KeyTextField | undefined {
  return field ?? undefined;
}

// Prismic often returns empty RichText fields as `[]`, this filters them out
export function transformRichTextField(
  field: RichTextField
): RichTextField | undefined {
  return field && field.length > 0 ? field : undefined;
}

// We have to use this annoyingly often as right at the beginning of the project
// we created titles as `RichTextField`s.
export function transformRichTextFieldToString(
  field: RichTextField
): string | undefined {
  return field && field.length > 0 ? prismicH.asText(field) : undefined;
}

export function asText(maybeContent?: RichTextField): string | undefined {
  return maybeContent && prismicH.asText(maybeContent).trim();
}

export function transformTitle(field: RichTextField): string {
  // We always need a title - blunt validation, but validation none the less
  return asText(field) || '';
}

export function transformBoolean(fragment: 'yes' | null): boolean {
  return fragment === 'yes';
}

type PromoImage = {
  image?: ImageType;
  squareImage?: ImageType;
  widescreenImage?: ImageType;
  superWidescreenImage?: ImageType;
};

export function transformGenericFields(doc: Doc): GenericContentFields {
  const { data } = doc;
  const promo = data.promo && parseImagePromo(data.promo);

  const promoImage: PromoImage =
    data.promo && data.promo.length > 0
      ? data.promo
          .filter(slice => slice.primary.image)
          .map(({ primary: { image } }) => {
            return {
              image: checkAndParseImage(image),
              squareImage: checkAndParseImage(image.square),
              widescreenImage: checkAndParseImage(image['16:9']),
              superWidescreenImage: checkAndParseImage(image['32:15']),
            };
          })
          .find(_ => _) || {}
      : {}; // just get the first one;

  const { image, squareImage, widescreenImage, superWidescreenImage } =
    promoImage;
  const body = data.body ? parseBody(data.body) : [];
  const standfirst = body.find(slice => slice.type === 'standfirst');
  const metadataDescription = data.metadataDescription || undefined;

  return {
    id: doc.id,
    title: parseTitle(data.title),
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
