import { ImageType } from '@weco/common/model/image';
import { Format } from './format';
import { Event } from './events';
import { Article } from './articles';
import { Season } from './seasons';
import { Page, ParentPage } from './pages';
import { Series } from './series';
import linkResolver from '../services/prismic/link-resolver';
import { Guide } from './guides';
import { EventSeries } from './event-series';
import { Exhibition } from './exhibitions';
import { Book } from './books';

export type Card = {
  type: 'card';
  format?: Format;
  title?: string;
  description?: string;
  image?: ImageType;
  link?: string;
  order?: number;
};

export function convertItemToCardProps(
  item:
    | Article
    | Event
    | Season
    | Page
    | Series
    | ParentPage
    | Guide
    | EventSeries
    | Exhibition
    | Book
): Card {
  const format =
    'format' in item
      ? item.format
      : item.type === 'series'
      ? // `id` needs to be something here, but as we're not
        // getting this from prismic, that'll do
        { title: 'Serial', id: '' }
      : undefined;

  return {
    type: 'card',
    format: format,
    title: item.title,
    order: 'order' in item ? item.order : undefined,
    description: (item.promo && item.promo.caption) ?? undefined,
    image:
      item.promo && item.promo.image
        ? {
            contentUrl: item.promo.image.contentUrl,
            alt: '',
            width: 1600,
            height: 900,
            tasl: item.promo.image.tasl,
            crops: {
              '16:9': {
                contentUrl:
                  item.image && item.image.crops && item.image.crops['16:9']
                    ? item.image.crops['16:9'].contentUrl
                    : '',
                alt: '',
                width: 1600,
                height: 900,
                crops: {},
                tasl: item.promo.image.tasl,
              },
            },
          }
        : undefined,
    link:
      (item.promo && item.promo.link) ||
      linkResolver({ id: item.id, type: item.type }),
  };
}
