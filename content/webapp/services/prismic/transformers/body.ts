import {
  Contact as ContactSlice,
  EditorialImageSlice,
  EditorialImageGallerySlice,
  Iframe as IframeSlice,
  InfoBlock as InfoBlockSlice,
  Map as MapSlice,
  MediaObjectList as MediaObjectListSlice,
  Quote as QuoteSlice,
  QuoteV2 as QuoteV2Slice,
  SearchResults as SearchResultsSlice,
  Standfirst as StandfirstSlice,
  Table as TableSlice,
  TagList as TagListSlice,
  TextSlice,
  DeprecatedImageList as DeprecatedImageListSlice,
  TitledTextList as TitledTextListSlice,
  GifVideoSlice,
  Discussion as DiscussionSlice,
} from '../types/body';
import { Props as TableProps } from '@weco/common/views/components/Table/Table';
import { Props as ContactProps } from '@weco/common/views/components/Contact/Contact';
import { Props as IframeProps } from '@weco/common/views/components/Iframe/Iframe';
import { Props as InfoBlockProps } from '@weco/common/views/components/InfoBlock/InfoBlock';
import { Props as AsyncSearchResultsProps } from '../../../components/SearchResults/AsyncSearchResults';
import { Props as QuoteProps } from '../../../components/Quote/Quote';
import { Props as ImageGalleryProps } from '../../../components/ImageGallery/ImageGallery';
import { Props as DeprecatedImageListProps } from '../../../components/DeprecatedImageList/DeprecatedImageList';
import { Props as GifVideoProps } from '../../../components/GifVideo/GifVideo';
import { Props as TitledTextListProps } from '../../../components/TitledTextList/TitledTextList';
import { Props as TagsGroupProps } from '@weco/common/views/components/TagsGroup/TagsGroup';
import { Props as MapProps } from '../../../components/Map/Map';
import { Props as DiscussionProps } from '../../../components/Discussion/Discussion';
import { MediaObjectType } from '../../../types/media-object';
import { isNotUndefined } from '@weco/common/utils/array';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToMediaField,
} from '../types';
import { TeamPrismicDocument } from '../types/teams';
import { transformCaptionedImage } from './images';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { CaptionedImage } from '@weco/common/model/captioned-image';
import {
  transformLink,
  asRichText,
  transformLabelType,
  asTitle,
  asText,
} from '.';
import { transformTaslFromString } from '@weco/common/services/prismic/transformers';
import { LinkField, RelationField, RichTextField } from '@prismicio/types';
import { Weight } from '../../../types/generic-content-fields';

export function getWeight(weight: string | null): Weight {
  switch (weight) {
    case 'featured':
      return weight;
    case 'standalone':
      return weight;
    case 'supporting':
      return weight;
    default:
      return 'default';
  }
}

type ParsedSlice<TypeName extends string, Value> = {
  type: TypeName;
  weight?: Weight;
  value: Value;
};

export function transformStandfirstSlice(
  slice: StandfirstSlice
): ParsedSlice<'standfirst', RichTextField> {
  return {
    type: 'standfirst',
    weight: getWeight(slice.slice_label),
    value: slice.primary.text,
  };
}

export function transformTextSlice(
  slice: TextSlice
): ParsedSlice<'text', RichTextField> {
  return {
    type: 'text',
    weight: getWeight(slice.slice_label),
    value: slice.primary.text,
  };
}

export function transformMapSlice(
  slice: MapSlice
): ParsedSlice<'map', MapProps> {
  return {
    type: 'map',
    value: {
      title: asText(slice.primary.title) || '',
      latitude: slice.primary.geolocation.latitude,
      longitude: slice.primary.geolocation.longitude,
    },
  };
}

function transformTableCsv(tableData: string): string[][] {
  return tableData
    .trim()
    .split(/[\r\n]+/)
    .map(row => row.split('|').map(cell => cell.trim()));
}

export function transformTableSlice(
  slice: TableSlice
): ParsedSlice<'table', TableProps> {
  return {
    type: 'table',
    value: {
      rows: slice.primary.tableData
        ? transformTableCsv(slice.primary.tableData)
        : [],
      caption: slice.primary.caption || undefined,
      hasRowHeaders: slice.primary.hasRowHeaders,
    },
  };
}

export function transformMediaObjectListSlice(
  slice: MediaObjectListSlice
): ParsedSlice<'mediaObjectList', { items: MediaObjectType[] }> {
  return {
    type: 'mediaObjectList',
    value: {
      items: slice.items
        .map(mediaObject => {
          if (mediaObject) {
            // make sure we have the content we require
            const title = mediaObject.title.length
              ? mediaObject?.title
              : undefined;
            const text = mediaObject.text.length
              ? mediaObject?.text
              : undefined;
            const image = mediaObject.image?.square?.dimensions
              ? mediaObject.image
              : undefined;
            return {
              title: title ? asTitle(title) : null,
              text: text ? asRichText(text) || null : null,
              image: transformImage(image) || null,
            };
          }
        })
        .filter(isNotUndefined),
    },
  };
}

export function transformTeamToContact(
  team: TeamPrismicDocument
): ContactProps {
  const {
    data: { title, subtitle, email, phone },
  } = team;

  return {
    title: asTitle(title),
    subtitle: asText(subtitle) || null,
    email,
    phone,
  };
}

export function transformContactSlice(
  slice: ContactSlice
): ParsedSlice<'contact', ContactProps> | undefined {
  return isFilledLinkToDocumentWithData(slice.primary.content)
    ? {
        type: 'contact',
        value: transformTeamToContact(slice.primary.content),
      }
    : undefined;
}

export function transformEditorialImageSlice(
  slice: EditorialImageSlice
): ParsedSlice<'picture', CaptionedImage> {
  return {
    weight: getWeight(slice.slice_label),
    type: 'picture',
    value: transformCaptionedImage(slice.primary),
  };
}

export function transformEditorialImageGallerySlice(
  slice: EditorialImageGallerySlice
): ParsedSlice<'imageGallery', ImageGalleryProps> {
  return {
    type: 'imageGallery',
    value: {
      title: asText(slice.primary.title),
      items: slice.items.map(item => transformCaptionedImage(item)),
      isStandalone: getWeight(slice.slice_label) === 'standalone',
    },
  };
}

export function transformDeprecatedImageListSlice(
  slice: DeprecatedImageListSlice
): ParsedSlice<'deprecatedImageList', DeprecatedImageListProps> {
  return {
    type: 'deprecatedImageList',
    weight: getWeight(slice.slice_label),
    value: {
      items: slice.items.map(item => ({
        title: asTitle(item.title),
        subtitle: asTitle(item.subtitle),
        // TODO: It's questionable whether we should be assigning a 'caption'
        // here or using a different transform function, but as this slice is
        // deprecated I don't really care.  Hopefully we'll just delete this
        // whole function soon.
        //
        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7680
        image: transformCaptionedImage({ ...item, caption: [] }),
        description: asRichText(item.description) || [],
      })),
    },
  };
}

export function transformGifVideoSlice(
  slice: GifVideoSlice
): ParsedSlice<'gifVideo', GifVideoProps> | undefined {
  const playbackRate = slice.primary.playbackRate
    ? parseFloat(slice.primary.playbackRate)
    : 1;
  return isFilledLinkToMediaField(slice.primary.video)
    ? {
        type: 'gifVideo',
        weight: getWeight(slice.slice_label),
        value: {
          caption: asRichText(slice.primary.caption),
          videoUrl: slice.primary.video.url,
          playbackRate,
          tasl: transformTaslFromString(slice.primary.tasl),
          autoPlay:
            slice.primary.autoPlay === null ? true : slice.primary.autoPlay, // handle old content before these fields existed
          loop: slice.primary.loop === null ? true : slice.primary.loop,
          mute: slice.primary.mute === null ? true : slice.primary.mute,
          showControls:
            slice.primary.showControls === null
              ? false
              : slice.primary.showControls,
        },
      }
    : undefined;
}

function transformTitledTextItem({
  title,
  text,
  link,
  label,
}: {
  title: RichTextField;
  text: RichTextField;
  link: LinkField;
  label: RelationField<'labels'>;
}) {
  return {
    title: asTitle(title),
    text: asRichText(text),
    link: transformLink(link),
    label: isFilledLinkToDocumentWithData(label)
      ? transformLabelType(label)
      : undefined,
  };
}

export function transformTitledTextListSlice(
  slice: TitledTextListSlice
): ParsedSlice<'titledTextList', TitledTextListProps> {
  return {
    type: 'titledTextList',
    value: {
      items: slice.items.map(item => transformTitledTextItem(item)),
    },
  };
}

export function transformDiscussionSlice(
  slice: DiscussionSlice
): ParsedSlice<'discussion', DiscussionProps> {
  return {
    type: 'discussion',
    value: {
      title: asTitle(slice.primary.title),
      text: asRichText(slice.primary.text) || [],
    },
  };
}

export function transformInfoBlockSlice(
  slice: InfoBlockSlice
): ParsedSlice<'infoBlock', InfoBlockProps> {
  return {
    type: 'infoBlock',
    value: {
      title: asTitle(slice.primary.title),
      text: slice.primary.text,
      linkText: slice.primary.linkText,
      link: transformLink(slice.primary.link),
    },
  };
}

export function transformIframeSlice(
  slice: IframeSlice
): ParsedSlice<'iframe', IframeProps> {
  return {
    type: 'iframe',
    weight: getWeight(slice.slice_label),
    value: {
      src: slice.primary.iframeSrc!,
      image: transformImage(slice.primary.previewImage)!,
    },
  };
}

export function transformQuoteSlice(
  slice: QuoteSlice | QuoteV2Slice
): ParsedSlice<'quote', QuoteProps> {
  return {
    type: 'quote',
    weight: getWeight(slice.slice_label),
    value: {
      text: slice.primary.text,
      citation: slice.primary.citation,
      isPullOrReview:
        slice.slice_label === 'pull' || slice.slice_label === 'review',
    },
  };
}

export function transformTagListSlice(
  slice: TagListSlice
): ParsedSlice<'tagList', TagsGroupProps> {
  return {
    type: 'tagList',
    value: {
      title: asTitle(slice.primary.title),
      tags: slice.items.map(item => ({
        textParts: item.linkText ? [item.linkText] : [],
        linkAttributes: {
          href: { pathname: transformLink(item.link) },
          as: { pathname: transformLink(item.link) },
        },
      })),
    },
  };
}

export function transformSearchResultsSlice(
  slice: SearchResultsSlice
): ParsedSlice<'searchResults', AsyncSearchResultsProps> {
  return {
    type: 'searchResults',
    weight: getWeight(slice.slice_label),
    value: {
      title: asText(slice.primary.title),
      query: slice.primary.query || '',
    },
  };
}
