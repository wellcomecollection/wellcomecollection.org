import { PrismicDocument, ImageField, KeyTextField } from '@prismicio/types';

export type BackgroundTexturesDocument = PrismicDocument<
  {
    image: ImageField;
    name: KeyTextField;
  },
  'background-textures'
>;
