/**
 * Maps work format labels (from the catalogue API's workType.label)
 * to thumbnail icon image paths (served from /icons/).
 *
 * Based on the groupings defined in:
 * https://github.com/wellcomecollection/wellcomecollection.org/issues/12802
 */
export function getFormatIconPath(formatLabel: string): string | undefined {
  switch (formatLabel) {
    // Archives and manuscripts
    case 'Archives and manuscripts':
    case 'Manuscripts':
    case 'Born digital archives':
      return '/icons/archives.svg';

    // Books and journals
    case 'Books':
    case 'E-books':
    case 'Journals':
    case 'E-journals':
    case 'Student dissertations':
      return '/icons/book.svg';

    // Images
    case 'Pictures':
    case 'Digital images':
    case 'Maps':
      return '/icons/image.svg';

    // Audio and video
    case 'Audio':
    case 'Video':
    case 'Music':
    case 'Film':
    case 'CD-Roms':
      return '/icons/video-audio.svg';

    // Ephemera
    case 'Ephemera':
      return '/icons/ephemera.svg';

    default:
      return undefined;
  }
}
