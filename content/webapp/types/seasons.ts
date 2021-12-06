import { Season as SeasonDeprecated } from '@weco/common/model/seasons';
import { Override } from '@weco/common/utils/utility-types';
import { SeasonPrismicDocument } from '../services/prismic/types/seasons';

export type Season = Override<
  SeasonDeprecated,
  {
    prismicDocument: SeasonPrismicDocument;
  }
>;
