import {
  ExhibitionGuidesDocument as RawExhibitionGuidesDocument,
  ExhibitionGuidesDocumentDataComponentsItem as RawExhibitionGuidesDocumentDataComponentsItem,
} from '@weco/common/prismicio-types';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import {
  isFilledLinkToDocumentWithData,
  isFilledLinkToMediaField,
} from '@weco/common/services/prismic/types';
import { dasherizeShorten } from '@weco/common/utils/grammar';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { PromoSliceZone } from '@weco/content/services/prismic/types';
import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionGuideComponent,
  ExhibitionGuideType,
  RelatedExhibition,
} from '@weco/content/types/exhibition-guides';

import { asRichText, asTitle } from '.';
import { getVimeoEmbedUrl, getYouTubeEmbedUrl } from './embeds';
import { transformImagePromo } from './images';

export function transformExhibitionGuideToExhibitionGuideBasic(
  exhibitionGuide: ExhibitionGuide
): ExhibitionGuideBasic {
  // returns what is required to render ExhibitionGuideLinkPromo
  return (({
    title,
    introText,
    type,
    id,
    uid,
    image,
    promo,
    relatedExhibition,
    availableTypes,
  }) => ({
    title,
    introText,
    type,
    id,
    uid,
    image,
    promo,
    relatedExhibition,
    availableTypes,
  }))(exhibitionGuide);
}

export function transformRelatedExhibition(exhibition): RelatedExhibition {
  const promo =
    exhibition.data.promo && transformImagePromo(exhibition.data.promo);

  return {
    id: exhibition.id,
    uid: exhibition.uid,
    title: asTitle(exhibition.data.title),
    description: promo?.caption,
  };
}

export function transformExhibitionGuide(
  document: RawExhibitionGuidesDocument
): ExhibitionGuide {
  const { data } = document;

  const components: ExhibitionGuideComponent[] = data.components?.map(
    (component: RawExhibitionGuidesDocumentDataComponentsItem, index) => {
      const title = asTitle(component.title);
      const standaloneTitle = asTitle(component.standaloneTitle);

      const displayTitle = title || standaloneTitle;
      const anchorId = `${dasherizeShorten(displayTitle)}-${index}`;
      return {
        number: component.number || undefined,
        displayTitle,
        anchorId,
        image: transformImage(component.image),
        captionsOrTranscripts: {
          title,
          standaloneTitle,
          context: component.context
            ? asRichText(component.context)
            : undefined,
          caption: component.caption
            ? asRichText(component.caption)
            : undefined,
          transcription: component.transcript
            ? asRichText(component.transcript)
            : undefined,
          tombstone: asRichText(component.tombstone),
        },
        audioWithoutDescription:
          isFilledLinkToMediaField(component['audio-without-description']) &&
          component['audio-without-description'].url
            ? { url: component['audio-without-description'].url }
            : undefined,
        bsl:
          component['bsl-video'].provider_name === 'YouTube'
            ? {
                embedUrl: getYouTubeEmbedUrl(component['bsl-video']),
                provider: 'YouTube' as const,
              }
            : component['bsl-video'].provider_name === 'Vimeo'
              ? {
                  embedUrl: getVimeoEmbedUrl(component['bsl-video']),
                  provider: 'Vimeo' as const,
                  thumbnail: component['bsl-video']
                    .thumbnail_url_with_play_button as string,
                }
              : undefined,
      };
    }
  );

  const introText = (data.introText && asRichText(data.introText)) || [];

  const relatedExhibitionField = data['related-exhibition'];
  const promo = isFilledLinkToDocumentWithData(relatedExhibitionField)
    ? transformImagePromo(relatedExhibitionField.data.promo as PromoSliceZone)
    : undefined;

  const relatedExhibition = isFilledLinkToDocumentWithData(
    data['related-exhibition']
  )
    ? transformRelatedExhibition(data['related-exhibition'])
    : undefined;

  const hasBSLVideo = components.some(({ bsl }) => isNotUndefined(bsl));
  const hasCaptionsOrTranscripts = components.some(
    ({ captionsOrTranscripts: captions }) =>
      isNotUndefined(captions?.caption) ||
      isNotUndefined(captions?.transcription)
  );
  const hasAudioWithoutDescriptions = components.some(
    component => component.audioWithoutDescription?.url
  );

  return {
    title: relatedExhibition?.title || '',
    introText,
    type: 'exhibition-guides',
    promo,
    relatedExhibition,
    components,
    id: document.id,
    uid: document.uid,
    availableTypes: {
      BSLVideo: hasBSLVideo,
      captionsOrTranscripts: hasCaptionsOrTranscripts,
      audioWithoutDescriptions: hasAudioWithoutDescriptions,
    },
  };
}

export function filterExhibitionGuideComponents(
  guide: ExhibitionGuide,
  guideType: ExhibitionGuideType
): ExhibitionGuide {
  // This does a couple of filter passes to reduce the size of the page props
  // we send when rendering the exhibition guides:
  //
  //    1.  If we're looking at a guide of type X, remove all the data about
  //        other guide types.
  //
  //        e.g. if we're on the BSL guide, we don't need to include the URLs
  //        for the audio tracks
  //
  //    2.  Remove any data about stops which aren't used in this guide type.
  //        We've decided we're not going to show them.
  //
  //        e.g. if we're on the BSL guide, the BSL guide has 5 videos, and
  //        the audio guide has 10 tracks, we only need to include the 5 stops
  //        which have BSL videos.
  //
  // Because the captions and transcripts are particularly data heavy, this can
  // have a dramatic impact on page size.
  //
  // See https://github.com/wellcomecollection/wellcomecollection.org/pull/8945 for stats.
  const filteredComponents = guide.components
    .map(c => ({
      ...c,
      captionsOrTranscripts:
        guideType === 'captions-and-transcripts'
          ? c.captionsOrTranscripts
          : undefined,
      audioWithoutDescription:
        guideType === 'audio-without-descriptions'
          ? c.audioWithoutDescription
          : undefined,
      bsl: guideType === 'bsl' ? c.bsl : undefined,
    }))
    .filter(c =>
      guideType === 'captions-and-transcripts'
        ? isNotUndefined(c.captionsOrTranscripts)
        : guideType === 'audio-without-descriptions'
          ? isNotUndefined(c.audioWithoutDescription)
          : guideType === 'bsl'
            ? isNotUndefined(c.bsl)
            : false
    );

  return {
    ...guide,
    components: filteredComponents,
  };
}
