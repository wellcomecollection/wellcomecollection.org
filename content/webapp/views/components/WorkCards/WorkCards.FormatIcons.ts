/**
 * Maps catalogue workType IDs to thumbnail icon image paths (served from /icons/).
 * to thumbnail icon image paths (served from /icons/).
 *
 * Based on the groupings defined in:
 * https://github.com/wellcomecollection/wellcomecollection.org/issues/12802
 */
export function getFormatIconPath(formatId?: string): string | undefined {
  switch (formatId) {
    // Archives and manuscripts
    case 'h': // Archives and manuscripts
    case 'b': // Manuscripts
    case 'hdig': // Born-digital archives
      return '/icons/archives-brand.svg';

    // Books and journals
    case 'a': // Books
    case 'd': // Journals
    case 'w': // Student dissertations
      return '/icons/book-brand.svg';

    // Images
    case 'k': // Pictures
    case 'q': // Digital Images
      return '/icons/image-brand.svg';

    // Audio and video
    case 'i': // Audio
    case 'g': // Videos
    case 'n': // Film
    case 'c': // Music
    case 'm': // CD-Roms
      return '/icons/video-audio-brand.svg';

    // Ephemera
    case 'l': // Ephemera
      return '/icons/ephemera-brand.svg';

    default:
      return undefined;
  }
}
