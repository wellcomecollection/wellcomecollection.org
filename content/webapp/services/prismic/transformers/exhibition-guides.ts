import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionGuideComponent,
  ExhibitionLink,
} from '../../../types/exhibition-guides';
import { ExhibitionGuidePrismicDocument } from '../types/exhibition-guides';
import { asRichText, asText } from '.';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';

export function transformExhibitionGuideToExhibitionGuideBasic(
  exhibitionGuide: ExhibitionGuide
): ExhibitionGuideBasic {
  // returns what is required to render StoryPromos and story JSON-LD
  return (({ type, id, title, relatedExhibition, components }) => ({
    type,
    id,
    title,
    relatedExhibition,
    components,
  }))(exhibitionGuide);
}

function transformRelatedExhibition(exhibition): ExhibitionLink {
  return {
    id: exhibition.id,
    title: (exhibition.data && asText(exhibition.data.title)) || '',
    description:
      exhibition.data &&
      asText(exhibition.data.promo[0].primary.caption[0].text),
  };
}

export function transformExhibitionGuide(
  document: ExhibitionGuidePrismicDocument
): ExhibitionGuide {
  const { data } = document;
  // const genericFields = transformGenericFields(document);

  const components: ExhibitionGuideComponent[] = data.components?.map(
    component => {
      return {
        number: component.number || [],
        title: (component.title && asText(component.title)) || [],
        tombstone:
          (component.tombstone && asRichText(component.tombstone)) || [],
        image: component.image,
        description:
          (component.description && asRichText(component.description)) || [],
        caption: (component.caption && asRichText(component.caption)) || [],
        transcript:
          (component.transcript && asRichText(component.transcript)) || [],
        audioWithDescription: component['audio-with-description'],
        audioWithoutDescription: component['audio-without-description'],
        bsl: component['bsl-video'],
      };
    }
  );

  const relatedExhibition = isFilledLinkToDocumentWithData(
    data['related-exhibition']
  )
    ? transformRelatedExhibition(data['related-exhibition'])
    : undefined;

  return {
    title: asText(document.data?.title),
    relatedExhibition,
    components,
    id: document.id,
    type: 'exhibition-guides',
  };
}
