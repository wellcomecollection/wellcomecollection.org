// @flow
import type {ContentType} from '../model/content-type';

export default function getIconForContentType(type: ContentType): ?string {
  switch (type) {
    case 'video':
      return 'play';
    case 'audio':
      return 'volume';
    case 'gallery':
      return 'gallery';
    default:
      return null;
  }
}
