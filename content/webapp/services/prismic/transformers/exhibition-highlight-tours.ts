import * as prismic from '@prismicio/client';
import { PromoSliceZone } from '@weco/content/services/prismic/types';
import {
  GuideStopSlice as RawGuideStopSlice,
  ExhibitionHighlightToursDocument as RawExhibitionHighlightToursDocument,
} from '@weco/common/prismicio-types';
import {
  PaginatedResults,
  isFilledLinkToMediaField,
  isFilledLinkToDocumentWithData,
} from '@weco/common/services/prismic/types';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { ExhibitionHighlightTour } from '@weco/content/types/exhibition-guides';
import { asRichText, asTitle } from '.';
import { transformImagePromo } from './images';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import { transformRelatedExhibition } from '@weco/content/services/prismic/transformers/exhibition-guides';
import { getYouTubeEmbedUrl } from '@weco/content/services/prismic/transformers/embeds';
import { ImageType } from '@weco/common/model/image';

export function transformExhibitionHighlightTours(
  document: RawExhibitionHighlightToursDocument
): ExhibitionHighlightTour {
  const { data } = document;
  const introText = (data.intro_text && asRichText(data.intro_text)) || [];
  const relatedExhibitionField = data.related_exhibition;
  const promo = isFilledLinkToDocumentWithData(data.related_exhibition)
    ? transformImagePromo(data.related_exhibition.data.promo as PromoSliceZone)
    : undefined;

  const relatedExhibition = isFilledLinkToDocumentWithData(
    relatedExhibitionField
  )
    ? transformRelatedExhibition(relatedExhibitionField)
    : undefined;

  const slices: RawGuideStopSlice[] = document.data.slices;
  const hasBSLVideo = slices.some(
    slice => slice.primary.bsl_video.provider_url
  );

  const hasAudioWithoutDescriptions = slices.some(
    slice =>
      isFilledLinkToMediaField(slice.primary.audio_with_description) &&
      slice.primary.audio_with_description.url
  );

  return {
    id: document.id,
    type: document.type,
    relatedExhibition,
    title: relatedExhibition?.title || asTitle(document.data.title),
    introText,
    promo,
    stops: data.slices,
    availableTypes: {
      captionsOrTranscripts: false,
      BSLVideo: hasBSLVideo,
      audioWithoutDescriptions: hasAudioWithoutDescriptions,
    },
  };
}

export function transformExhibitionHighlightToursQuery(
  query: prismic.Query<RawExhibitionHighlightToursDocument>
): PaginatedResults<ExhibitionHighlightTour> {
  const paginatedResult = transformQuery(query, exhibitionTexts =>
    transformExhibitionHighlightTours(exhibitionTexts)
  );

  return paginatedResult;
}

type GuideHighlightTour = {
  number: number | undefined;
  title: string;
  audio: string | undefined;
  transcript: prismic.RichTextField | undefined;
  audioDuration: number | undefined;
  video: string | undefined;
  subtitles: prismic.RichTextField | undefined;
  videoDuration: number | undefined;
  image: ImageType | undefined;
};

export function transformGuideStopSlice(
  slice: RawGuideStopSlice
): GuideHighlightTour {
  const title = asTitle(slice.primary.title);
  return {
    number: slice.primary.number || undefined,
    title,
    audio: isFilledLinkToMediaField(slice.primary.audio_with_description)
      ? slice.primary.audio_with_description.url
      : undefined,
    transcript: slice.primary.transcript
      ? asRichText(slice.primary.transcript)
      : undefined,
    audioDuration: slice.primary.audio_duration || undefined,
    video:
      slice.primary.bsl_video.provider_name === 'YouTube'
        ? getYouTubeEmbedUrl(slice.primary.bsl_video)
        : undefined,
    subtitles: slice.primary.subtitles
      ? asRichText(slice.primary.subtitles)
      : undefined,
    videoDuration: slice.primary.video_duration || undefined,
    image: slice.primary.image
      ? transformImage(slice.primary.image)
      : undefined,
  };
}
