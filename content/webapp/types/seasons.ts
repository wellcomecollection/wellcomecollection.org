import { Season as SeasonDeprecated } from '@weco/common/model/seasons';
import { Override } from '@weco/common/utils/utility-types';

export type Season = Override<
  SeasonDeprecated,
  {
    datePublished?: Date;
  }
>;
