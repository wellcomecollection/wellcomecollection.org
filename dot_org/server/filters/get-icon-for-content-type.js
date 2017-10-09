export default function getIconForContentType(type) {
  switch (type) {
    case 'video':
      return 'actions/play';
    case 'audio':
      return 'actions/volume';
    case 'gallery':
      return 'actions/gallery';
    default:
      return false;
  }
}
