import { EventSeries } from './event-series';
import { ArticleBasic } from './articles';
import { BookBasic } from './books';
import { EventBasic } from './events';
import { ExhibitionBasic } from './exhibitions';
import { Page } from './pages';
import { Series, SeriesBasic } from './series';
import { Guide } from './guides';
import { Weblink } from './weblinks';
import { Project } from './projects';
import { Season } from './seasons';
import { ExhibitionGuide, ExhibitionGuideBasic } from './exhibition-guides';
import { Card } from './card';
import { VisualStory } from './visual-stories';

export type MultiContent =
  | Page
  | EventSeries
  | BookBasic
  | EventBasic
  | ArticleBasic
  | ExhibitionBasic
  | Series
  | SeriesBasic
  | Guide
  | Weblink
  | Project
  | Season
  | ExhibitionGuide
  | ExhibitionGuideBasic
  | VisualStory
  | Card;
