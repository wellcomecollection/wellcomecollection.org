import { ColorSelection } from './color-selections';

import { CommonFields } from './common';
import { Article } from './articles';
import { Season } from './seasons';

export type ArticleScheduleItem = {
  type: 'article-schedule-items';
  id: string;
  title: string;
  url: string;
  publishDate: Date;
  partNumber: number;
  color?: ColorSelection;
};

type ItemType = Article | ArticleScheduleItem;

export type ArticleSeries = CommonFields & {
  type: 'series';
  schedule: ArticleScheduleItem[];
  items: readonly ItemType[];
  color?: ColorSelection;
  seasons: Season[];
};
