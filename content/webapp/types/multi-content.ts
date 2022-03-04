import { EventSeries } from './event-series';
import { Article } from './articles';
import { Book } from "./books";
import { Event } from "./events";
import { Exhibition } from "./exhibitions";
import { Page } from './pages';
import { Series } from "./series";
import { Guide } from './guides';
import { Weblink } from './weblinks';
import { Project } from './projects';

export type MultiContent =
  | Page
  | EventSeries
  | Book
  | Event
  | Article
  | Exhibition
  | Series
  | Guide
  | Weblink
  | Project;
