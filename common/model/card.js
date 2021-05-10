// @flow
import { type ImageType } from '@weco/common/model/image';
import { type Format } from '@weco/common/model/format';
import type { UiEvent } from '@weco/common/model/events';
import type { Article } from '@weco/common/model/articles';
import type { Season } from '@weco/common/model/seasons';
import type { Page, ParentPage } from '@weco/common/model/pages';
import type { ArticleSeries } from '@weco/common/model/article-series';
import linkResolver from '@weco/common/services/prismic/link-resolver';

export type Card = {|
  type: 'card',
  format: ?Format,
  title: ?string,
  description: ?string,
  image: ?ImageType,
  link: ?string,
  order: ?number,
|};

export function convertItemToCardProps(
  item: Article | UiEvent | Season | Page | ArticleSeries | ParentPage
): Card {
  return {
    type: 'card',
    format: item.format || null,
    title: item.title,
    order: item.order || null,
    description: item.promo && item.promo.caption,
    image: item.promo &&
      item.promo.image && {
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
      },
    link:
      (item.promo && item.promo.link) ||
      linkResolver({ id: item.id, type: item.type }),
  };
}
