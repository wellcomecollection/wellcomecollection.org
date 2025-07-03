import { ImageType } from '@weco/common/model/image';
import { Label } from '@weco/common/model/labels';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { ArticleBasic } from '@weco/content/types/articles';
import { BookBasic } from '@weco/content/types/books';
import { Card } from '@weco/content/types/card';
import { EventSeries } from '@weco/content/types/event-series';
import { EventBasic } from '@weco/content/types/events';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Guide } from '@weco/content/types/guides';
import { Link } from '@weco/content/types/link';
import { Page } from '@weco/content/types/pages';
import { Season } from '@weco/content/types/seasons';
import { SeriesBasic } from '@weco/content/types/series';

export type PartialFeaturedCard = {
  image?: ImageType;
  labels: Label[];
  link: Link;
};

export function convertCardToFeaturedCardProps(
  item: Card
): PartialFeaturedCard {
  return {
    // We intentionally omit the alt text on promos, so screen reader
    // users don't have to listen to the alt text before hearing the
    // title of the item in the list.
    //
    // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
    image: item.image && {
      ...item.image,
      alt: '',
    },
    labels: item.format ? [{ text: item.format.title }] : [],
    link: { url: item.link || '', text: item.title || '' },
  };
}

export function convertItemToFeaturedCardProps(
  item:
    | ArticleBasic
    | ExhibitionBasic
    | Season
    | Page
    | EventSeries
    | BookBasic
    | SeriesBasic
    | EventBasic
    | Guide
): PartialFeaturedCard {
  return {
    image: item.promo?.image && {
      ...item.promo.image,
      // We intentionally omit the alt text on promos, so screen reader
      // users don't have to listen to the alt text before hearing the
      // title of the item in the list.
      //
      // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
      alt: '',
    },
    labels: item.labels,
    link: {
      url: linkResolver(item),
      text: item.title,
    },
  };
}
