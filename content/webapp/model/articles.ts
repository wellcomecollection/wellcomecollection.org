import { RichTextField } from '@prismicio/types';
import { CommonFields } from './common';
import { ArticleSeries } from './article-series';
import { ColorSelection } from './color-selections';
import { Season } from './seasons';
import { Format } from './format';
import { ArticlePrismicDocument } from '../services/prismic/articles';
import { ContentType } from './content-type';

export const ArticleFormatIds = {
  InPictures: 'W5uKaCQAACkA3C0T',
  Essay: 'W7TfJRAAAJ1D0eLK',
  Comic: 'W7d_ghAAALWY3Ujc',
  Podcast: 'XwRZ6hQAAG4K-bbt',
  Article: 'W7TfJRAAAJ1D0eLK',
  PhotoStory: 'XTYCkRAAACUANeph',
  Interview: 'W9BoHhIAANBp1EXg',
  BookExtract: 'W8CbPhEAAB8Nq4aG',
} as const;

type ArticleFormatId = typeof ArticleFormatIds[keyof typeof ArticleFormatIds];

export type Article = CommonFields & {
  type: 'articles';
  format?: Format<ArticleFormatId>;
  datePublished: Date;
  standfirst?: RichTextField;
  series: ArticleSeries[];
  seasons: Season[];
  color?: ColorSelection;
  outroResearchLinkText?: string;
  outroResearchItem?: ContentType;
  outroReadLinkText?: string;
  outroReadItem?: ContentType;
  outroVisitLinkText?: string;
  outroVisitItem?: ContentType;
  prismicDocument: ArticlePrismicDocument;
};
