import { ColorSelection } from './color-selections';
import { GenericContentFields } from './generic-content-fields';
import { ArticleScheduleItem } from './article-schedule-items';
import { ArticleBasic } from './articles';
import { Contributor } from './contributors';
import { Season } from './seasons';
import { ImagePromo } from './image-promo';
import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';

export type SeriesBasic = {
  type: 'series';
  id: string;
  title: string;
  promo?: ImagePromo | undefined;
  image?: ImageType | undefined;
  color?: ColorSelection;
  schedule: ArticleScheduleItem[];
  labels: Label[];
};

export type Series = GenericContentFields & {
  type: 'series';
  color?: ColorSelection;
  schedule: ArticleScheduleItem[];
  seasons: Season[];
  items: ArticleBasic[];
  contributors: Contributor[];
};
