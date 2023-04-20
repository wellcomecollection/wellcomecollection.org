import { PrismicDocument, ImageField, KeyTextField } from '@prismicio/types';
import { FetchLinks } from '.';

export type BackgroundTexturesDocument = PrismicDocument<
  {
    image: ImageField;
    name: KeyTextField;
  },
  'background-textures'
>;
export const backgroundTexturesFetchLink: FetchLinks<BackgroundTexturesDocument> =
  ['background-textures.name', 'background-textures.image'];