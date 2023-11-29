import { ArticleFormatId } from '@weco/content/data/content-format-ids';
import * as prismic from '@prismicio/client';
import {
  WellcomeAggregation,
  WellcomeResultList,
} from '@weco/content/services/wellcome';
import { CustomPrismicFilledImage } from '@weco/common/services/prismic/types';

export type ContentApiProps = {
  query?: string;
  page?: number;
  sort?: string;
  sortOrder?: string;
  aggregations?: string[];
};

export type ArticleFormat = {
  type: 'ArticleFormat';
  id: ArticleFormatId;
  label: string;
};

export type Article = {
  id: string;
  title: string;
  publicationDate: string;
  contributors: Contributor[];
  format: ArticleFormat;
  image?: prismic.EmptyImageFieldImage | CustomPrismicFilledImage;
  caption?: string;
  type: 'Article';
};

// Contributors (e.g. author, photographer)
type BasicContributorInformation = {
  id: string;
  label?: string;
};

type Contributor = {
  type: 'Contributor';
  contributor?: BasicContributorInformation & {
    type: 'Person' | 'Organisation';
  };
  role?: BasicContributorInformation & {
    type: 'EditorialContributorRole';
  };
};

export type ArticleAggregations = {
  format: WellcomeAggregation;
  'contributors.contributor': WellcomeAggregation;
  type: 'Aggregations';
};

export type ResultType = Article;

export type ContentResultsList<Result extends ResultType> = WellcomeResultList<
  Result,
  Result extends Article ? ArticleAggregations : null
>;
