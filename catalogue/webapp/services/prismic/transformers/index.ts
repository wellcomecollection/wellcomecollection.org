import {
  PrismicResponse,
  TransformedResponse,
  ContentType,
  Contributor,
} from '../types';
import { articleIdToLabel } from '../fetch';
import { isNotUndefined } from '@weco/common/utils/array';

export async function transformPrismicResponse(
  type: ContentType[],
  edges: PrismicResponse[]
): Promise<TransformedResponse[]> {
  const results = edges.map(edge => {
    const { node } = edge;
    const { title, contributors, promo, _meta, format } = node;
    const { id, firstPublicationDate } = _meta;
    const { primary: image } = promo[0];
    const summary = image.caption[0].text;
    const isArticle = type.includes('articles');
    // in some cases we don't have contributors
    const allContributors = contributors
      ?.map(contributor => {
        const { contributor: contributorNode }: Contributor = contributor;
        const hasContributor = contributor.contributor
          ? contributorNode?.name
          : undefined;
        return hasContributor;
      })
      .filter(isNotUndefined);

    return {
      id,
      title: title[0]?.text,
      image: {
        url: image.image?.url,
        width: image.image?.dimensions?.width,
        height: image.image?.dimensions?.height,
      },
      url: `https://wellcomecollection.org/${type}/${id}`,
      firstPublicationDate,
      contributors: allContributors,
      type: type,
      summary: summary,
      label:
        isArticle && format
          ? { text: articleIdToLabel(format._meta.id) }
          : { text: 'Article' },
    };
  });
  return results;
}
