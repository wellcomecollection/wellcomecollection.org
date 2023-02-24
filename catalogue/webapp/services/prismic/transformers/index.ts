import { PrismicResponse, Story, Contributor } from '../types';
import { isNotUndefined } from '@weco/common/utils/array';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import linkResolver from '@weco/common/services/prismic/link-resolver';

export async function transformPrismicResponse(
  edges: PrismicResponse[],
  type: 'articles' = 'articles'
): Promise<Story[]> {
  const results = edges.map(edge => {
    const { node } = edge;
    const { title, contributors, promo, _meta, format } = node;
    const { id, firstPublicationDate } = _meta;
    const image = promo?.[0]?.primary;

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
      image: transformImage(image?.image),
      url: linkResolver({ id, type }),
      firstPublicationDate,
      contributors: allContributors,
      type,
      summary: image?.caption?.[0].text,
      format: format?.title?.[0].text || 'Article',
    };
  });

  return results;
}
