import {
  ImageField,
  ImageFieldImage,
  KeyTextField,
  RichTextField,
  Slice,
  SliceZone,
} from '@prismicio/types';

type Dimension = {
  width: number;
  height: number;
};

// Currently the Prismic types only allow you to specify 1 image
type ThumbnailedImageField<Thumbnails extends Record<string, Dimension>> =
  ImageField & {
    [Property in keyof Thumbnails]: ImageFieldImage & Thumbnails[Property];
  };

export type Image = ThumbnailedImageField<{
  '32:15': {
    width: 3200;
    height: 1500;
  };
  '16:9': {
    width: 3200;
    height: 1800;
  };
  square: {
    width: 3200;
    height: 3200;
  };
}>;

export type Promo = SliceZone<
  Slice<
    'editorialImage',
    { caption: RichTextField; image: Image; text: KeyTextField }
  >
>;
