import { getCrop, ImageType } from '@weco/common/model/image';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import { SiteSection } from '@weco/common/views/components/PageLayout/PageLayout';
import { ArticleBasic } from '@weco/content/types/articles';
import { Book } from '@weco/content/types/books';
import { EventSeries } from '@weco/content/types/event-series';
import { EventBasic } from '@weco/content/types/events';
import {
  ExhibitionGuide,
  ExhibitionGuideBasic,
} from '@weco/content/types/exhibition-guides';
import { ExhibitionBasic } from '@weco/content/types/exhibitions';
import { Format } from '@weco/content/types/format';
import { Guide } from '@weco/content/types/guides';
import { Page, ParentPage } from '@weco/content/types/pages';
import { Project } from '@weco/content/types/projects';
import { Season } from '@weco/content/types/seasons';
import { Series, SeriesBasic } from '@weco/content/types/series';
import { VisualStoryBasic } from '@weco/content/types/visual-stories';

export type Card = {
  type: 'card';
  id?: string;
  format?: Format;
  title?: string;
  description?: string;
  image?: ImageType;
  link?: string;
  order?: number;
  siteSection?: SiteSection;
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
    | VisualStoryBasic
): Card {
  const format =
    'format' in item
      ? item.format
      : item.type === 'series'
        ? // `id` needs to be something here, but as we're not
          // getting this from prismic, that'll do
          { title: 'Serial', id: '' }
        : undefined;
  const linkData =
    'relatedDocument' in item
      ? {
          id: item.id,
          uid: item.uid,
          type: item.type,
          siteSection: 'siteSection' in item ? item.siteSection : undefined,
          data: { relatedDocument: item.relatedDocument },
        }
      : {
          id: item.id,
          uid: item.uid,
          type: item.type,
          siteSection: 'siteSection' in item ? item.siteSection : undefined,
        };

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
    link: (item.promo && item.promo.link) || linkResolver(linkData),
    siteSection: 'siteSection' in item ? item.siteSection : undefined,
  };
}
