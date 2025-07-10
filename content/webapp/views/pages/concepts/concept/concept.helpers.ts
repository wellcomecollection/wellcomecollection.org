import { ReturnedResults } from '@weco/common/utils/search';
import {
  ConceptType,
  Image as ImageType,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';

export type ThemeTabType = 'by' | 'in' | 'about';
export const themeTabOrder: ThemeTabType[] = ['by', 'in', 'about'];

export type SectionData = {
  label: string;
  works?: ReturnedResults<WorkBasic>;
  images?: ReturnedResults<ImageType>;
  totalResults: { works?: number; images?: number };
};

export type ThemePageSectionsData = {
  about: SectionData;
  by: SectionData;
  in: SectionData;
};

export const getThemeTabLabel = (
  type: ThemeTabType,
  conceptType: ConceptType
) => {
  if (type === 'about' && conceptType === 'Person') return 'featuring';
  if (type === 'in') return 'using';
  return type;
};
