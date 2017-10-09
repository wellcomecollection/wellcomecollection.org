// @flow
export type ContentType =
  | 'comic'
  | 'article'
  | 'audio'
  | 'video'
  | 'gallery'
  | 'book'
  | 'event';

const contentTypeMap = {
  'standard': 'article',
  'image': 'comic',
  'video': 'video',
  'audio': 'audio',
  'gallery': 'gallery',
  'book': 'book',
  'event': 'event'
};

export function getContentType(wpType: string): ContentType {
  return contentTypeMap[wpType];
}
