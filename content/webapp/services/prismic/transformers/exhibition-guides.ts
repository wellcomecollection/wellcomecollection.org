import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionGuideComponent,
  Exhibit,
} from '../../../types/exhibition-guides';
import { asRichText, asText, transformGenericFields } from '.';
import { ExhibitionGuidePrismicDocument } from '../types/exhibition-guides';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { transformImagePromo } from './images';

// TODO It's likely that we will need to construct a hierarchy of components within a guide.
// For example, to facilitate collapsing sections in the UI.
// With the addition of a partOf field to the model, as has previously been discussed,
// this function will generate the necessary structure.
// It relies on there being a top level component with no partOf assigned to it.

// export function constructHierarchy(components) {
//   // TODO type function return
//   const groupedSections = groupBy(components, component => {
//     const partOf = component.partOf;
//     if (!partOf) {
//       return 'Guide';
//     }
//     return partOf;
//   });
//   const levels = Object.keys(groupedSections).length;
//   for (let level = 0; level < levels; level++) {
//     for (const [key, value] of Object.entries(groupedSections)) {
//       const itemsWithParts = value.map(item => {
//         const { partOf, ...restOfItem } = item;
//         const parts = groupedSections[item.title];
//         if (parts) {
//           return {
//             ...restOfItem,
//             parts: groupedSections[item.title],
//           };
//         } else {
//           return restOfItem;
//         }
//       });
//       groupedSections[key] = itemsWithParts;
//     }
//   }

//   return groupedSections?.['Guide'];
// }

// const componentsKeys = Object.keys(components);
//
// const filterByGuide = components.filter(value => {
//   return components[value].caption;
// });
//
// TODO: Filters for guide types

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
  }) => ({
    type,
    id,
    title,
    image,
    promo,
    relatedExhibition,
    components,
  }))(exhibitionGuide);
}

function transformRelatedExhibition(exhibition): Exhibit {
  return {
    exhibitType: 'exhibitions',
    item: undefined,
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
  const genericFields = transformGenericFields(document);
  const { data } = document;

  const components: ExhibitionGuideComponent[] = data.components?.map(
    (component, index) => {
      return {
        number: index.toString(), // TODO: Remove once Prismic UI allows us to add number
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
    ...genericFields,
    type: 'exhibition-guides',
    title: asText(document.data?.title) || '',
    promo,
    relatedExhibition,
    components,
    id: document.id,
  };
}
