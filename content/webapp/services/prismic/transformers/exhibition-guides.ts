import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionGuideComponent,
  Exhibit,
} from '../../../types/exhibition-guides';
import { asRichText, asText } from '.';
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
  return (({ title, type, id, image, promo, relatedExhibition }) => ({
    title,
    type,
    id,
    image,
    promo,
    relatedExhibition,
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

function transformYoutubeEmbed(embed) {
  // TODO share some of this with transformEmbedSlice?
  if (embed.provider_url === 'https://www.youtube.com/') {
    const embedUrl = embed.html!.match(/src="([^"]+)"?/)![1];

    const embedUrlWithEnhancedPrivacy = embedUrl.replace(
      'www.youtube.com',
      'www.youtube-nocookie.com'
    );

    const newEmbedUrl = embedUrl.includes('?')
      ? embedUrlWithEnhancedPrivacy.replace('?', '?rel=0&')
      : `${embedUrlWithEnhancedPrivacy}?rel=0`;

    return {
      embedUrl: newEmbedUrl as string,
    };
  } else {
    return {};
  }
}

export function transformExhibitionGuide(
  document: ExhibitionGuidePrismicDocument
): ExhibitionGuide {
  const { data } = document;

  const components: ExhibitionGuideComponent[] = data.components?.map(
    component => {
      return {
        number: component.number || '',
        title: (component.title && asText(component.title)) || [],
        tombstone:
          (component.tombstone && asRichText(component.tombstone)) || [],
        image: component.image,
        context: (component.context && asRichText(component.context)) || [],
        caption: (component.caption && asRichText(component.caption)) || [],
        transcription:
          (component.transcript && asRichText(component.transcript)) || [],
        audioWithDescription: component['audio-with-description'], // TODO make the same as other audio transforms
        audioWithoutDescription: component['audio-without-description'], // TODO make the same as other audio transforms
        bsl: component['bsl-video'].provider_name
          ? transformYoutubeEmbed(component['bsl-video'])
          : {},
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
    title: relatedExhibition?.title || '',
    type: 'exhibition-guides',
    promo,
    relatedExhibition,
    components,
    id: document.id,
  };
}
