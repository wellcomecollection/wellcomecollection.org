import { ColorSelection } from './color-selections';
import { GenericContentFields } from './generic-content-fields';
import { ArticleScheduleItem } from './article-schedule-items';
import { ArticleBasic } from './articles';
import { Contributor } from './contributors';
import { Season } from './seasons';
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';

export type SeriesBasic = {
  type: 'series';
  id: string;
  title: string;
  color?: ColorSelection;
  schedule: ArticleScheduleItem[];
  promo: ImagePromo | undefined;
  image: ImageType | undefined;
};

export type Series = GenericContentFields & {
  type: 'series';
  schedule: ArticleScheduleItem[];
  color?: ColorSelection;
  seasons: Season[];
  items: ArticleBasic[];
  contributors: Contributor[];
};
