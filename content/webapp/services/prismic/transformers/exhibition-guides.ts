import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionGuideComponent,
  ExhibitionLink,
} from '../../../types/exhibition-guides';
import { asRichText, asText } from '.';
import { ExhibitionGuidePrismicDocument } from '../types/exhibition-guides';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { transformImagePromo } from './images';
import { ImagePromo } from '../../../types/image-promo';

export function transformExhibitionGuideToExhibitionGuideBasic(
  exhibitionGuide: ExhibitionGuide
): ExhibitionGuideBasic {
  // returns what is required to render StoryPromos and story JSON-LD
  return (({
    type,
    id,
    title,
    image,
    promo,
    relatedExhibition,
    components,
    start,
    isPermanent,
    contributors,
    labels,
  }) => ({
    type,
    id,
    title,
    image,
    promo,
    relatedExhibition,
    components,
    start,
    isPermanent,
    contributors,
    labels,
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
): {
  promo: ImagePromo | string;
  components: ExhibitionGuideComponent[];
  id: string;
  title: string | undefined;
  type: string;
  relatedExhibition: ExhibitionLink | undefined;
} {
  const { data } = document;

  const components: ExhibitionGuideComponent[] = data.components?.map(
    (component, index) => {
      return {
        number: index.toString(),
        title: (component.title && asText(component.title)) || [],
        tombstone:
          (component.tombstone && asRichText(component.tombstone)) || [],
        image: component.image,
        description:
          (component.description && asRichText(component.description)) || [],
        caption: (component.caption && asRichText(component.caption)) || [],
        transcription:
          (component.transcript && asRichText(component.transcript)) || [],
        audioWithDescription: component['audio-with-description'],
        audioWithoutDescription: component['audio-without-description'],
        bsl: component['bsl-video'],
      };
    }
  );

  // const componentsKeys = Object.keys(components);
  //
  // const filterByGuide = components.filter(value => {
  //   return components[value].caption;
  // });
  //
  // TODO: Filters for guide types

  const promo =
    (data['related-exhibition'].data.promo &&
      transformImagePromo(data['related-exhibition'].data.promo)) ||
    '';

  const relatedExhibition = isFilledLinkToDocumentWithData(
    data['related-exhibition']
  )
    ? transformRelatedExhibition(data['related-exhibition'])
    : undefined;

  return {
    title: asText(document.data?.title),
    promo,
    relatedExhibition,
    components,
    id: document.id,
    type: 'exhibition-guides',
  };
}
