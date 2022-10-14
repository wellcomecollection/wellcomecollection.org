export const mimeTypes = {
  'application/pdf': ['pdf'],
  'audio/mp3': ['mp3'],
  'image/jpeg': ['jpeg', 'jpg'],
  'text/plain': ['txt', 'text'],
  'video/mp4': ['mp4'],
};

/**
 *
 * @param extension - the file extension with NO '.' character
 * @returns will return either the MIME type or an empty string
 */
export const getMimeTypeFromExtension = (extension: string): string => {
  for (const type in mimeTypes) {
    if (mimeTypes[type].includes(extension)) return type;
  }
  return '';
};
