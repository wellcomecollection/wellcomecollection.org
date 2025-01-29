import * as prismic from '@prismicio/client';

import {
  ExhibitionTextsDocument as RawExhibitionTextsDocument,
  GuideSectionHeadingSlice as RawGuideSectionHeadingSlice,
  GuideTextItemSlice as RawGuideTextItemSlice,
} from '@weco/common/prismicio-types';
import type { PaginatedResults } from '@weco/common/services/prismic/types';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { transformRelatedExhibition } from '@weco/content/services/prismic/transformers/exhibition-guides';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { PromoSliceZone } from '@weco/content/services/prismic/types';
import {
  ExhibitionGuideBasic,
  ExhibitionHighlightTour,
  ExhibitionText,
} from '@weco/content/types/exhibition-guides';

import { asRichText, asTitle } from '.';
import { transformImagePromo } from './images';

export function transformToBasic(
  fullDocument: ExhibitionText | ExhibitionHighlightTour
): ExhibitionGuideBasic {
  // returns what is required to render ExhibitionGuideLinkPromo
  return (({
    title,
    introText,
    type,
    id,
    uid,
    promo,
    relatedExhibition,
    availableTypes,
  }) => ({
    title,
    introText,
    type,
    id,
    uid,
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
    uid: document.uid,
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
  transcript: prismic.RichTextField | undefined;
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
    transcript: slice.primary.transcript
      ? asRichText(slice.primary.transcript)
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
