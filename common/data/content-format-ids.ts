export const ArticleFormatIds = {
  ImageGallery: 'W5uKaCQAACkA3C0T', // Should this be called In Pictures?  https://wellcomecollection.prismic.io/documents~k=article-formats&b=working&c=published&l=en-gb/W5uKaCQAACkA3C0T/
  Article: 'W7TfJRAAAJ1D0eLK',
  Comic: 'W7d_ghAAALWY3Ujc',
  Podcast: 'XwRZ6hQAAG4K-bbt',
  BookExtract: 'W8CbPhEAAB8Nq4aG',
  LongRead: 'YxcjgREAACAAkjBg',
  ProsePem: 'YrwCTxEAACUALJQ0',
  PhotoStory: 'XTYCkRAAACUANeph',
  Interview: 'W9BoHhIAANBp1EXg',
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

export type ArticleFormatId =
  typeof ArticleFormatIds[keyof typeof ArticleFormatIds];
export type PageFormatId = typeof PageFormatIds[keyof typeof PageFormatIds];
export type GuideFormatId = typeof GuideFormatIds[keyof typeof GuideFormatIds];
