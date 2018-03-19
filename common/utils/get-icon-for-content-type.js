// @flow
export default function getIconForContentType(type) {
  switch (type) {
    case 'video':
      return 'play';
    case 'audio':
      return 'volume';
    case 'gallery':
      return 'gallery';
    default:
      return false;
  }
}
