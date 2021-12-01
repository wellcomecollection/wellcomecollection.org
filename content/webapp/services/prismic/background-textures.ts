// Annoyingly this file and type is called series, but it is only used for articles
import { PrismicDocument, ImageField, KeyTextField } from '@prismicio/types';

export type BackgroundTexturesDocument = PrismicDocument<
  {
    image: ImageField;
    name: KeyTextField;
  },
  'background-textures'
>;
