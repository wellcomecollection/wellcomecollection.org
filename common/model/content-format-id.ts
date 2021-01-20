export const ContentFormatIds = {
  ImageGallery: 'W5uKaCQAACkA3C0T',
  Essay: 'W7TfJRAAAJ1D0eLK',
  Comic: 'W7d_ghAAALWY3Ujc',
  Podcast: 'XwRZ6hQAAG4K-bbt',
} as const;

export type ContentFormatId = typeof ContentFormatIds[keyof typeof ContentFormatIds];
