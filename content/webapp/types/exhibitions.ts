import { Exhibition as DeprecatedExhibition } from '@weco/common/model/exhibitions';
import { Override } from '@weco/common/utils/utility-types';
import { ExhibitionPrismicDocument } from '../services/prismic/types/exhibitions';
import { Article } from './articles';
import { Book } from './books';
import { Event } from './events';

export type Exhibition = Override<
  DeprecatedExhibition,
  {
    prismicDocument: ExhibitionPrismicDocument;
  }
>;

export type ExhibitionRelatedContent = {
  exhibitionOfs: (Exhibition | Event)[];
  exhibitionAbouts: (Book | Article)[];
};
