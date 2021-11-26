import { PrismicDocument } from '@prismicio/types';
import { Label } from '@weco/common/model/labels';
import * as prismicH from 'prismic-helpers-beta';
import { CommonPrismicData, Image } from './types';

type Meta = {
  title: string;
  type: 'website' | 'article' | 'book' | 'profile' | 'video' | 'music';
  url: string;
  description?: string;
  promoText?: string;
  image?: Image;
};

type Doc = PrismicDocument<CommonPrismicData>;

export function transformMeta(doc: Doc): Meta {
  const promo = tranformPromo(doc);

  return {
    title: prismicH.asText(doc.data.title),
    type: 'website',
    // We use `||` over `??` as we want empty strigs to revert to undefined
    description: doc.data.metadataDescription || undefined,
    promoText: prismicH.asText([]) || undefined,
    image: promo.image,
    // TODO: This needs to account for more cases, should probably use the link resolver.
    url: `/${doc.type}/${doc.id}`,
  };
}

function tranformPromo(doc: Doc) {
  /**
   * this is a little bit annoying as we modelled this at a stage where Prismic was suggesting
   * "use slices for all the things!". Unfortunately it definitely wasn't made for this, and
   * we should have robably just had `.image` and `.description`.
   * We could reimport into these fields, but it would have to be the whole Prismic corpus,
   * and we aren't confident enough that it imports correctly.
   *
   * This method flattens out the `SliceZone` into just a Promo
   */

  return doc.data?.promo?.[0].primary;
}

export function transformLabels(doc: Doc): Label[] {
  const typeLabels = {
    seasons: [{ text: 'Season' }],
  };

  const labels = typeLabels[doc.type];
  return labels ?? [];
}
