import { MediaObjectList, Table } from '../types/body';
import { Props as TableProps } from '@weco/common/views/components/Table/Table';
import { MediaObjectType } from '@weco/common/model/media-object';
import { parseImage, parseStructuredText, parseTitle } from '@weco/common/services/prismic/parsers';
import { isNotUndefined } from '@weco/common/utils/array';

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

function transformTableCsv(tableData: string): string[][] {
  return tableData
    .trim()
    .split(/[\r\n]+/)
    .map(row => row.split('|').map(cell => cell.trim()));
}

export function transformTableSlice(
  slice: Table
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
  slice: MediaObjectList
): ParsedSlice<'mediaObjectList', { items: Array<MediaObjectType> }> {
  return {
    type: 'mediaObjectList',
    value: {
      items: slice.items.map(mediaObject => {
        if (mediaObject) {
          // make sure we have the content we require
          const title = mediaObject.title.length ? mediaObject?.title : undefined;
          const text = mediaObject.text.length ? mediaObject?.text : undefined;
          const image = mediaObject.image?.square?.dimensions
            ? mediaObject.image
            : undefined;
          return {
            title: title ? parseTitle(title) : null,
            text: text ? parseStructuredText(text) : null,
            image: image ? parseImage(image) : null,
          };
        }
      }).filter(isNotUndefined),
    },
  };
}