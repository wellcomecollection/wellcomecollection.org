import * as prismic from '@prismicio/client';

import {
  ExhibitionHighlightToursDocument as RawExhibitionHighlightToursDocument,
  GuideStopSlice as RawGuideStopSlice,
} from '@weco/common/prismicio-types';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToMediaField,
  PaginatedResults,
} from '@weco/common/services/prismic/types';
import {
  getVimeoEmbedUrl,
  getYouTubeEmbedUrl,
} from '@weco/content/services/prismic/transformers/embeds';
import { transformRelatedExhibition } from '@weco/content/services/prismic/transformers/exhibition-guides';
import { transformQuery } from '@weco/content/services/prismic/transformers/paginated-results';
import { PromoSliceZone } from '@weco/content/services/prismic/types';
import {
  ExhibitionHighlightTour,
  GuideHighlightTour,
} from '@weco/content/types/exhibition-guides';

import { asRichText, asTitle } from '.';
import { transformImagePromo } from './images';

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
    uid: document.uid,
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

export function transformGuideStopSlice(
  slice: RawGuideStopSlice
): GuideHighlightTour {
  const title = asTitle(slice.primary.title);

  // We only support YT and Vimeo at the moment
  const videoProvider =
    slice.primary?.bsl_video?.provider_name === 'YouTube' ||
    slice.primary?.bsl_video?.provider_name === 'Vimeo'
      ? slice.primary?.bsl_video?.provider_name
      : undefined;

  // We get the YouTube video through their API, so we don't need it here.
  const videoThumbnail =
    videoProvider === 'Vimeo'
      ? (slice.primary.bsl_video?.thumbnail_url_with_play_button as string)
      : undefined;

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
      videoProvider === 'YouTube'
        ? getYouTubeEmbedUrl(slice.primary.bsl_video)
        : videoProvider === 'Vimeo'
          ? getVimeoEmbedUrl(slice.primary.bsl_video)
          : undefined,
    videoProvider,
    videoThumbnail,
    subtitles: slice.primary.subtitles
      ? asRichText(slice.primary.subtitles)
      : undefined,
    videoDuration: slice.primary.video_duration || undefined,
    image: slice.primary.image
      ? transformImage(slice.primary.image)
      : undefined,
  };
}
