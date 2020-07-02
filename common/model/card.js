// @flow
import { type ImageType } from '@weco/common/model/image';
import { type Format } from '@weco/common/model/format';
import type { UiEvent } from '@weco/common/model/events';
import type { Article } from '@weco/common/model/articles';
import type { LandingPage } from '@weco/common/model/landing-pages';

export type Card = {|
  type: 'card',
  format: ?Format,
  title: ?string,
  description: ?string,
  image: ?ImageType,
  link: ?string,
|};

export function convertItemToCardProps(
  item: Article | UiEvent | LandingPage
): Card {
  return {
    type: 'card',
    format: null,
    title: item.title,
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
              item.image &&
              item.image.crops &&
              item.image.crops['16:9'] &&
              item.image.crops['16:9'].contentUrl,
            alt: '',
            width: 1600,
            height: 900,
          },
        },
      },
    link: item.promo && item.promo.link,
  };
}
