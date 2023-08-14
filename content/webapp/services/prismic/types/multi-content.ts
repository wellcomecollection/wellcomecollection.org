import { PagePrismicDocument } from '../types/pages';
import { EventSeriesPrismicDocument } from '../types/event-series';
import { BookPrismicDocument } from '../types/books';
import { EventPrismicDocument } from '../types/events';
import { ArticlePrismicDocument } from '../types/articles';
import { ExhibitionPrismicDocument } from '../types/exhibitions';
import { SeriesPrismicDocument } from '../types/series';
import { CardPrismicDocument } from '../types/card';

export type StructuredSearchQuery = {
  types: string[];
  type: string[];
  ids: string[];
  id: string[];
  tags: string[];
  tag: string[];
  pageSize: number;
  orderings: string[];
  // content type specific
  'article-series': string[];
};

export type MultiContentPrismicDocument =
  | PagePrismicDocument
  | EventSeriesPrismicDocument
  | BookPrismicDocument
  | EventPrismicDocument
  | ArticlePrismicDocument
  | ExhibitionPrismicDocument
  | SeriesPrismicDocument
  | CardPrismicDocument;
