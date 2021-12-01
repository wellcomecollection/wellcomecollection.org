import { ArticlePrismicDocument } from '../articles';
import { Article } from '../../../model/articles';
import * as prismicH from 'prismic-helpers-beta';
import { isSliceType } from '../body';
import { transformMeta } from '../transformers';

export function transformer(document: ArticlePrismicDocument): Article {
  const meta = transformMeta(document);
  const standfirstSlice = document.data.body.find(slice =>
    isSliceType(slice, 'standfirst')
  );
  // I'm not 100% sure why I need the double type guard on the slice... save for later
  const standfirst =
    standfirstSlice && isSliceType(standfirstSlice, 'standfirst')
      ? standfirstSlice.primary.text
      : undefined;

  return {
    id: document.id,
    title: meta.title,
    contributorsTitle: prismicH.asText(document.data.contributorsTitle),
    contributors: [],
    promoText: meta.promoText,
    promoImage: meta.image,
    squareImage: undefined,
    superWidescreenImage: undefined,
    widescreenImage: undefined,
    body: document.data.body,
    metadataDescription: meta.description,

    type: document.type,
    standfirst,
    datePublished: new Date(),
    series: [],
    seasons: [],
    outroReadItem: undefined,
    outroReadLinkText: undefined,
    outroResearchItem: undefined,
    outroResearchLinkText: undefined,
    outroVisitItem: undefined,
    outroVisitLinkText: undefined,
    prismicDocument: document,
  };
}

// export type GenericContentFields = {
//   id: string;
//   title: string;
//   contributorsTitle: string | null;
//   contributors: Contributor[];
//   promo: ImagePromo | null;
//   body: BodyType;
//   standfirst: HTMLString | null;
//   promoText: string | null;
//   promoImage: Picture | null;
//   image: ImageType | null;
//   squareImage: ImageType | null;
//   widescreenImage: ImageType | null;
//   superWidescreenImage: ImageType | null;
//   metadataDescription: string | null;
//   labels: Label[];
// };

// export type Article = GenericContentFields & {
//   type: 'articles';
//   format?: Format<ArticleFormatId>;
//   datePublished: Date;
//   series: ArticleSeries[];
//   seasons: Season[];
//   color?: ColorSelection;
//   outroResearchLinkText?: string;
//   outroResearchItem?: MultiContent;
//   outroReadLinkText?: string;
//   outroReadItem?: MultiContent;
//   outroVisitLinkText?: string;
//   outroVisitItem?: MultiContent;
//   prismicDocument: any;
// };
