import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionGuideComponent,
  ExhibitionLink,
} from '../../../types/exhibition-guides';
import { ExhibitionGuidePrismicDocument } from '../types/exhibition-guides';
// import groupBy from 'lodash.groupby';
import { asHtml, asRichText, asText, transformGenericFields } from '.';
import { ExhibitionFormat as ExhibitionFormatPrismicDocument } from '../types/exhibitions';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';

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
//
//   return groupedSections?.['Guide'];
// }

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

function transformExhibitionFormat(
  format: ExhibitionFormatPrismicDocument
): ExhibitionLink {
  return {
    id: format.id,
    title: (format.data && asText(format.data.title)) || '',
    description: format.data && asHtml(format.data.description),
  };
}

export function transformExhibitionGuide(
  document: ExhibitionGuidePrismicDocument
): ExhibitionGuide {
  const { data } = document;
  const genericFields = transformGenericFields(document);
  console.log(data, 'RAW DATA FROM GUIDES');

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
    ? transformExhibitionFormat(data['related-exhibition'] as ExhibitionFormat)
    : undefined;

  console.log(relatedExhibition, '<<<<< the data!');

  return {
    ...genericFields,
    components,
    id: document.id,
    relatedExhibition,
    type: 'exhibition-guides',
  };
}
