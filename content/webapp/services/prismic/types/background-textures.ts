import * as prismic from '@prismicio/client';
import { FetchLinks } from '.';

export type BackgroundTexturesDocument = prismic.PrismicDocument<
  {
    image: prismic.ImageField;
    name: prismic.KeyTextField;
  },
  'background-textures'
>;
export const backgroundTexturesFetchLink: FetchLinks<BackgroundTexturesDocument> =
  ['background-textures.name', 'background-textures.image'];
