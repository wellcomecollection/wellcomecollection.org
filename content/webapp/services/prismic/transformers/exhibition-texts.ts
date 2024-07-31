import * as prismic from '@prismicio/client';
import { PromoSliceZone } from '@weco/content/services/prismic/types';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import {
  ExhibitionText,
  ExhibitionHighlightTour,
  ExhibitionGuideBasic,
} from '@weco/content/types/exhibition-guides';
import {
  ExhibitionTextsDocument as RawExhibitionTextsDocument,
  GuideTextItemSlice as RawGuideTextItemSlice,
  GuideSectionHeadingSlice as RawGuideSectionHeadingSlice,
} from '@weco/common/prismicio-types';
import { asRichText, asTitle } from '.';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { transformImagePromo } from './images';
import { transformRelatedExhibition } from '@weco/content/services/prismic/transformers/exhibition-guides';

export function transformToBasic(
  fullDocument: ExhibitionText | ExhibitionHighlightTour
): ExhibitionGuideBasic {
  // returns what is required to render ExhibitionGuideLinkPromo
  return (({
    title,
    introText,
    type,
    id,
    promo,
    relatedExhibition,
    availableTypes,
  }) => ({
    title,
    introText,
    type,
    id,
    promo,
    relatedExhibition,
    availableTypes,
  }))(fullDocument);
}

export function transformExhibitionTexts(
  document: RawExhibitionTextsDocument
): ExhibitionText {
  const { data } = document;
  const introText = (data.intro_text && asRichText(data.intro_text)) || [];
  const relatedExhibitionField = data.related_exhibition;
  const promo = isFilledLinkToDocumentWithData(relatedExhibitionField)
    ? transformImagePromo(relatedExhibitionField.data.promo as PromoSliceZone)
    : undefined;

  const relatedExhibition = isFilledLinkToDocumentWithData(
    relatedExhibitionField
  )
    ? transformRelatedExhibition(relatedExhibitionField)
    : undefined;

  return {
    id: document.id,
    type: document.type,
    relatedExhibition,
    title: relatedExhibition?.title || asTitle(document.data.title),
    introText,
    promo,
    textItems: data.slices,
    availableTypes: {
      captionsOrTranscripts: document.data.slices.length > 0,
      BSLVideo: false,
      audioWithoutDescriptions: false,
    },
  };
}

export function transformExhibitionTextsQuery(
  query: prismic.Query<RawExhibitionTextsDocument>
): PaginatedResults<ExhibitionText> {
  const paginatedResult = transformQuery(query, exhibitionTexts =>
    transformExhibitionTexts(exhibitionTexts)
  );

  return paginatedResult;
}

type GuideTextItem = {
  number: number | undefined;
  title: string;
  caption: prismic.RichTextField | undefined;
  tombstone: prismic.RichTextField | undefined;
  additional_notes: prismic.RichTextField | undefined;
};

export function transformGuideTextItemSlice(
  slice: RawGuideTextItemSlice
): GuideTextItem {
  const title = asTitle(slice.primary.title);

  return {
    number: slice.primary.number || undefined,
    title,
    tombstone: asRichText(slice.primary.tombstone),
    caption: slice.primary.caption
      ? asRichText(slice.primary.caption)
      : undefined,
    additional_notes: slice.primary.additional_notes
      ? asRichText(slice.primary.additional_notes)
      : undefined,
  };
}

type GuideSectionHeading = {
  number: number | undefined;
  title: string;
  subtitle: string;
  text: prismic.RichTextField | undefined;
};

export function transformGuideSectionHeadingSlice(
  slice: RawGuideSectionHeadingSlice
): GuideSectionHeading {
  const title = asTitle(slice.primary.title);
  return {
    number: slice.primary.number || undefined,
    title,
    subtitle: asTitle(slice.primary.subtitle),
    text: slice.primary.text ? asRichText(slice.primary.text) : undefined,
  };
}
