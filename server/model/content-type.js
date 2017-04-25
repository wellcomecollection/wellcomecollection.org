// @flow
export type ContentType =
  | 'comic'
  | 'article'
  | 'audio'
  | 'video'
  | 'gallery'; // So far we use article, comic and video

const contentTypeMap = {
  'standard': 'article',
  'image': 'comic',
  'video': 'video',
  'audio': 'audio',
  'gallery': 'gallery'
};

export function getContentType(wpType: string): ContentType {
  return contentTypeMap[wpType];
}
