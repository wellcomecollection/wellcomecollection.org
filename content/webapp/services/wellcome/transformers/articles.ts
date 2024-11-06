import { transformImage } from '@weco/common/services/prismic/transformers/images';
import {
  Article,
  Contributor,
} from '@weco/content/services/wellcome/content/types/api';
import { ArticleBasic } from '@weco/content/types/articles';

export function transformContentApiArticle(response: Article): Omit<
  ArticleBasic,
  'series' | 'datePublished' | 'labels'
> & {
  series: { title: string; schedule: [] }[];
  contributors: Contributor[];
} {
  const image = response.image?.['16:9'] || response.image;

  return {
    type: 'articles',
    promo: {
      image: image && transformImage(image),
      caption: response.caption,
    },
    contributors: response.contributors,
    id: response.id,
    uid: response.uid,
    title: response.title,
    format: {
      id: response.format.id,
      title: response.format.label,
    },
    series: response.seriesTitle
      ? [{ title: response.seriesTitle, schedule: [] }]
      : [],
  };
}
