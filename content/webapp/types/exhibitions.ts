import { Exhibition as DeprecatedExhibition } from '@weco/common/model/exhibitions';
import { Override } from '@weco/common/utils/utility-types';
import { Article } from './articles';
import { Book } from './books';
import { Contributor } from './contributors';
import { Event } from './events';

export type Exhibition = Override<
  DeprecatedExhibition,
  {
    contributors: Contributor[];
  }
>;

export type ExhibitionRelatedContent = {
  exhibitionOfs: (Exhibition | Event)[];
  exhibitionAbouts: (Book | Article)[];
};
