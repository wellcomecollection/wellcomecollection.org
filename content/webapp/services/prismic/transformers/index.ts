import * as prismicH from '@prismicio/helpers';
import {
  PrismicDocument,
  FilledLinkToDocumentField,
  KeyTextField,
  LinkField,
  RichTextField,
  TimestampField,
} from '@prismicio/types';
import { Label } from '@weco/common/model/labels';
import { WithSeries } from '../types/articles';
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
  transformContactSlice,
  transformDeprecatedImageListSlice,
  transformDiscussionSlice,
  transformEditorialImageGallerySlice,
  transformEditorialImageSlice,
  transformGifVideoSlice,
  transformIframeSlice,
  transformInfoBlockSlice,
  transformMapSlice,
  transformMediaObjectListSlice,
  transformQuoteSlice,
  transformStandfirstSlice,
  transformTableSlice,
  transformTextSlice,
  transformTitledTextListSlice,
} from './body';
import { transformImage, transformImagePromo } from './images';
import { Tasl } from '@weco/common/model/tasl';
import { licenseTypeArray } from '@weco/common/model/license';
import { HTMLString } from '@weco/common/services/prismic/types';
import { WithPageFormat } from '../types/pages';
import { WithEventFormat } from '../types/events';
import { Format } from '../../../types/format';
import { LabelField } from '@weco/common/model/label-field';
import { ArticleFormat } from '../types/article-format';
import { ArticleFormatId } from '@weco/common/services/prismic/content-format-ids';
import * as prismicT from '@prismicio/types';

type Doc = PrismicDocument<CommonPrismicFields>;

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

export function asRichText(field: RichTextField): HTMLString | undefined {
  return nonEmpty(field) ? (field as HTMLString) : undefined;
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
    description: format.data.description
      ? (format.data.description as HTMLString)
      : [],
  };
}

type PromoImage = {
  image?: ImageType;
  squareImage?: ImageType;
  widescreenImage?: ImageType;
  superWidescreenImage?: ImageType;
};

// TODO: Consider moving this into a dedicated file for body transformers.
// TODO: Rather than doing transformation inline, have this function consistently
// call out to other transformer functions (a la contentList).
// See https://github.com/wellcomecollection/wellcomecollection.org/pull/7679/files#r811138079
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
          type ContentListPrismicDocument =
            | MultiContentPrismicDocument
            | GuidePrismicDocument
            | SeasonPrismicDocument
            | CardPrismicDocument;

          const contents: ContentListPrismicDocument[] = slice.items
            .map(item => item.content)
            .filter(isFilledLinkToDocumentWithData);

          return {
            type: 'contentList',
            weight: getWeight(slice.slice_label),
            value: {
              title: asText(slice.primary.title),
              // TODO: The old code would look up a `hasFeatured` field on `slice.primary`,
              // but that doesn't exist in our Prismic model.
              // hasFeatured: slice.primary.hasFeatured,
              items: contents
                .map(content => {
                  switch (content.type) {
                    case 'pages':
                      return transformPage(content);
                    case 'guides':
                      return transformGuide(content);
                    case 'event-series':
                      return transformEventSeries(content);
                    case 'exhibitions':
                      return transformExhibition(content);
                    case 'articles':
                      return transformArticle(content);
                    case 'events':
                      return transformEvent(content);
                    case 'seasons':
                      return transformSeason(content);
                    case 'card':
                      return transformCard(content);
                  }
                })
                .filter(Boolean),
            },
          };

        case 'collectionVenue':
          return isFilledLinkToDocumentWithData(slice.primary.content)
            ? {
                type: 'collectionVenue',
                weight: getWeight(slice.slice_label),
                value: {
                  content: transformCollectionVenue(slice.primary.content),
                  showClosingTimes: slice.primary.showClosingTimes,
                },
              }
            : undefined;

        case 'searchResults':
          return {
            type: 'searchResults',
            weight: getWeight(slice.slice_label),
            value: {
              title: asText(slice.primary.title),
              query: slice.primary.query,
              // TODO: The untyped version of this code had `slice.primary.pageSize`, but
              // there's no such field on the Prismic model.  Should it be on the model?
              // Does it matter?  Investigate further.
              pageSize: 4,
            },
          };

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
          const embed = slice.primary.embed;

          if (embed.provider_name === 'Vimeo') {
            const embedUrl = slice.primary.embed.html?.match(
              /src="([-a-zA-Z0-9://.?=_]+)?/
            )![1];

            return {
              type: 'videoEmbed',
              weight: getWeight(slice.slice_label),
              value: {
                embedUrl: `${embedUrl}?rel=0&dnt=1`,
                caption: slice.primary.caption,
              },
            };
          }

          if (embed.provider_name === 'SoundCloud') {
            const apiUrl = embed.html!.match(/url=([^&]*)&/)!;
            const secretToken = embed.html!.match(/secret_token=([^"]*)"/);
            const secretTokenString =
              secretToken && secretToken[1]
                ? `%3Fsecret_token%3D${secretToken[1]}`
                : '';

            return {
              type: 'soundcloudEmbed',
              weight: getWeight(slice.slice_label),
              value: {
                embedUrl: `https://w.soundcloud.com/player/?url=${apiUrl[1]}${secretTokenString}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`,
                caption: slice.primary.caption,
              },
            };
          }

          if (embed.provider_name === 'YouTube') {
            // The embed will be a blob of HTML of the form
            //
            //    <iframe src=\"https://www.youtube.com/embed/RTlA8X0EJ7w...\" ...></iframe>
            //
            // We want to add the query parameter ?rel=0
            const embedUrl =
              slice.primary.embed.html!.match(/src="([^"]+)"?/)![1];

            const embedUrlWithEnhancedPrivacy = embedUrl.replace(
              'www.youtube.com',
              'www.youtube-nocookie.com'
            );

            const newEmbedUrl = embedUrl.includes('?')
              ? embedUrlWithEnhancedPrivacy.replace('?', '?rel=0&')
              : `${embedUrlWithEnhancedPrivacy}?rel=0`;

            return {
              type: 'videoEmbed',
              weight: getWeight(slice.slice_label),
              value: {
                embedUrl: newEmbedUrl,
                caption: slice.primary.caption,
              },
            };
          }
          break;

        case 'table':
          return transformTableSlice(slice);

        case 'infoBlock':
          return transformInfoBlockSlice(slice);

        case 'discussion':
          return transformDiscussionSlice(slice);

        case 'tagList':
          return {
            type: 'tagList',
            value: {
              title: asTitle(slice.primary.title),
              tags: slice.items.map(item => ({
                textParts: [item.linkText],
                linkAttributes: {
                  href: { pathname: transformLink(item.link), query: '' },
                  as: { pathname: transformLink(item.link), query: '' },
                },
              })),
            },
          };

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
