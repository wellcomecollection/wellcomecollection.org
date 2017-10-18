// @flow
export type ContentType =
  | 'comic'
  | 'article'
  | 'audio'
  | 'video'
  | 'gallery'
  | 'book'
  | 'event';

const contentTypeMapWP = {
  'standard': 'article',
  'image': 'comic',
  'video': 'video',
  'audio': 'audio',
  'gallery': 'gallery',
  'book': 'book',
  'event': 'event'
};

export function getContentTypeFromWPType(wpType: string): ContentType {
  return contentTypeMapWP[wpType];
}
