import { getCrop, ImageType } from '@weco/common/model/image';
import { Format } from './format';
import { EventBasic } from './events';
import { ArticleBasic } from './articles';
import { Season } from './seasons';
import { Page, ParentPage } from './pages';
import { Series, SeriesBasic } from './series';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { EventSeries } from './event-series';
import { Book } from './books';
import { ExhibitionBasic } from './exhibitions';
import { Guide } from './guides';
import { Project } from './projects';
import { ExhibitionGuide, ExhibitionGuideBasic } from './exhibition-guides';

export type Card = {
  type: 'card';
  id?: string;
  format?: Format;
  title?: string;
  description?: string;
  image?: ImageType;
  link?: string;
  order?: number;
};

export function convertItemToCardProps(
  item:
    | ArticleBasic
    | EventBasic
    | Season
    | Page
    | Series
    | SeriesBasic
    | ParentPage
    | EventSeries
    | Book
    | ExhibitionBasic
    | Guide
    | Project
    | ExhibitionGuide
    | ExhibitionGuideBasic
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
    format: format as never, // TODO: This is now warning for use of any, need to specify type correctly
    title: item.title,
    order: 'order' in item ? item.order : undefined,
    description: (item.promo && item.promo.caption) ?? undefined,
    image:
      item.promo && item.promo.image
        ? {
            contentUrl: item.promo.image.contentUrl,
            // We intentionally omit the alt text on promos, so screen reader
            // users don't have to listen to the alt text before hearing the
            // title of the item in the list.
            //
            // See https://github.com/wellcomecollection/wellcomecollection.org/issues/6007
            alt: '',
            width: 1600,
            height: 900,
            tasl: item.promo.image.tasl,
            simpleCrops: {
              '16:9': {
                contentUrl: getCrop(item.image, '16:9')?.contentUrl || '',
                width: 1600,
                height: 900,
              },
            },
          }
        : undefined,
    link:
      (item.promo && item.promo.link) ||
      linkResolver({ id: item.id, type: item.type }),
  };
}
