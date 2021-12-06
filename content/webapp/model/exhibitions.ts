import { Exhibition as DeprecatedExhibition } from '@weco/common/model/exhibitions';
import { Override } from '@weco/common/utils/utility-types';
import { ExhibitionPrismicDocument } from '../services/prismic/exhibitions';

export type Exhibition = Override<
  DeprecatedExhibition,
  {
    prismicDocument: ExhibitionPrismicDocument;
  }
>;
