import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
  ExhibitionGuideComponent,
  Exhibit,
} from '../../../types/exhibition-guides';
import { asRichText, asText, asTitle } from '.';
import {
  ExhibitionGuideComponentPrismicDocument,
  ExhibitionGuidePrismicDocument,
} from '../types/exhibition-guides';
import { isFilledLinkToDocumentWithData } from '@weco/common/services/prismic/types';
import { transformImagePromo } from './images';
import { getYouTubeEmbedUrl } from 'utils/embed-urls';
import * as prismicT from '@prismicio/types';
import { transformImage } from '@weco/common/services/prismic/transformers/images';

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
    title,
    introText,
    type,
    id,
    image,
    promo,
    relatedExhibition,
  }) => ({
    title,
    introText,
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
    title: asTitle(exhibition.data.title),
    description:
      exhibition.data &&
      asText(exhibition.data.promo[0].primary.caption[0].text),
  };
}

function transformYoutubeEmbed(embed: prismicT.EmbedField): {
  embedUrl?: string;
} {
  return embed.provider_url === 'https://www.youtube.com/'
    ? {
        embedUrl: getYouTubeEmbedUrl(embed),
      }
    : {};
}

export function transformExhibitionGuide(
  document: ExhibitionGuidePrismicDocument
): ExhibitionGuide {
  const { data } = document;

  const components: ExhibitionGuideComponent[] = data.components?.map(
    (component: ExhibitionGuideComponentPrismicDocument) => {
      return {
        number: component.number!,
        title: asTitle(component.title),
        standaloneTitle: asTitle(component.standaloneTitle),
        tombstone: asRichText(component.tombstone) || [],
        image: transformImage(component.image),
        context: asRichText(component.context),
        caption: asRichText(component.caption) || [],
        transcription: asRichText(component.transcript) || [],
        audioWithDescription: component['audio-with-description'] as any, // TODO make the same as other audio transforms
        audioWithoutDescription: component['audio-without-description'] as any, // TODO make the same as other audio transforms
        bsl: component['bsl-video'].provider_name
          ? transformYoutubeEmbed(component['bsl-video'])
          : {},
      };
    }
  );

  const promo = isFilledLinkToDocumentWithData(data['related-exhibition'])
    ? transformImagePromo(data['related-exhibition'].data.promo)
    : undefined;

  const relatedExhibition = isFilledLinkToDocumentWithData(
    data['related-exhibition']
  )
    ? transformRelatedExhibition(data['related-exhibition'])
    : undefined;

  return {
    title: relatedExhibition?.title || '',
    introText: asRichText(data.introText),
    type: 'exhibition-guides',
    promo,
    relatedExhibition,
    components,
    id: document.id,
  };
}
