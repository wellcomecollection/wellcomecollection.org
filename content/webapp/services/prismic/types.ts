import {
  FilledImageFieldImage,
  KeyTextField,
  RichTextField,
  Slice,
  SliceZone,
  RTHeading1Node,
} from '@prismicio/types';
import { Body } from './prismic-body';

type Dimension = {
  width: number;
  height: number;
};

export type Crop = '32:15' | '16:9' | 'square';

// Currently the Prismic types only allow you to specify 1 image
type ThumbnailedImageField<Thumbnails extends Record<string, Dimension>> =
  FilledImageFieldImage & {
    [Property in keyof Thumbnails]?: FilledImageFieldImage;
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

type Promo = { caption: RichTextField; image: Image; link: KeyTextField };
type PromoSliceZone = SliceZone<Slice<'editorialImage', Promo>>;

export type CommonPrismicData = {
  title: [RTHeading1Node];
  body: Body;
  promo: PromoSliceZone;
  metadataDescription: KeyTextField;
};
