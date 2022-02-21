// TODO: Move these into hardcoded-id.ts
export const ArticleFormatIds = {
  ImageGallery: 'W5uKaCQAACkA3C0T',
  Essay: 'W7TfJRAAAJ1D0eLK',
  Comic: 'W7d_ghAAALWY3Ujc',
  Podcast: 'XwRZ6hQAAG4K-bbt',
} as const;

export const PageFormatIds = {
  Landing: 'YBwQWxMAACAAuno1',
} as const;

export const GuideFormatIds = {
  HowTo: 'YC_GIhMAACAADdCN',
  Topic: 'YC_GQRMAACIADdEh',
  LearningResource: 'YC_GrhMAACMADdMc',
  ExhibitionGuide: 'YC_GfxMAACEADdI9',
} as const;

export type ArticleFormatId =
  typeof ArticleFormatIds[keyof typeof ArticleFormatIds];
export type PageFormatId = typeof PageFormatIds[keyof typeof PageFormatIds];
export type GuideFormatId = typeof GuideFormatIds[keyof typeof GuideFormatIds];
