// @flow
export const ArticleFormatIds = {
  ImageGallery: 'W5uKaCQAACkA3C0T',
  Essay: 'W7TfJRAAAJ1D0eLK',
  Comic: 'W7d_ghAAALWY3Ujc',
  Podcast: 'XwRZ6hQAAG4K-bbt',
};

export const PageFormatIds = {
  Landing: 'YBwQWxMAACAAuno1',
};

export const GuideFormatIds = {
  HowTo: 'YC_GIhMAACAADdCN',
  Topic: 'YC_GQRMAACIADdEh',
  LearningResource: 'YC_GrhMAACMADdMc',
  ExhibitionGuide: 'YC_GfxMAACEADdI9',
};

export type ArticleFormatId = $Values<typeof ArticleFormatIds>;
export type PageFormatId = $Values<typeof PageFormatIds>;
export type GuideFormatId = $Values<typeof GuideFormatIds>;
