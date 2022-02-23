import {
  Contact as ContactSlice,
  EditorialImageSlice,
  EditorialImageGallerySlice,
  MediaObjectList as MediaObjectListSlice,
  Table as TableSlice,
  DeprecatedImageList as DeprecatedImageListSlice,
} from '../types/body';
import { Props as TableProps } from '@weco/common/views/components/Table/Table';
import { Props as ContactProps } from '@weco/common/views/components/Contact/Contact';
import { Props as ImageGalleryProps } from '../../../components/ImageGallery/ImageGallery';
import { Props as DeprecatedImageListProps } from '@weco/common/views/components/DeprecatedImageList/DeprecatedImageList';
import { MediaObjectType } from '@weco/common/model/media-object';
import {
  parseStructuredText,
  parseTitle,
  asText,
} from '@weco/common/services/prismic/parsers';
import { isNotUndefined } from '@weco/common/utils/array';
import { isFilledLinkToDocumentWithData } from '../types';
import { TeamPrismicDocument } from '../types/teams';
import { transformCaptionedImage, transformImage } from './images';
import { CaptionedImage } from '@weco/common/model/captioned-image';

export type Weight = 'default' | 'featured' | 'standalone' | 'supporting';

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
  value: Value;
};

type WeightedSlice = {
  weight: Weight;
};

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
              title: title ? parseTitle(title) : null,
              text: text ? parseStructuredText(text) : null,
              image: transformImage(image) || null,
            };
          }
        })
        .filter(isNotUndefined),
    },
  };
}

export function transformTeamToContact(team: TeamPrismicDocument) {
  const {
    data: { title, subtitle, email, phone },
  } = team;

  return {
    title: asText(title),
    subtitle: asText(subtitle),
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
): ParsedSlice<'picture', CaptionedImage> & WeightedSlice {
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
): ParsedSlice<'deprecatedImageList', DeprecatedImageListProps> &
  WeightedSlice {
  return {
    type: 'deprecatedImageList',
    weight: getWeight(slice.slice_label),
    value: {
      items: slice.items.map(item => ({
        title: parseTitle(item.title),
        subtitle: parseTitle(item.subtitle),
        // TODO: It's questionable whether we should be assigning a 'caption'
        // here or using a different transform function, but as this slice is
        // deprecated I don't really care.  Hopefully we'll just delete this
        // whole function soon.
        //
        // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7680
        image: transformCaptionedImage({ ...item, caption: [] }),
        description: parseStructuredText(item.description),
      })),
    },
  };
}
