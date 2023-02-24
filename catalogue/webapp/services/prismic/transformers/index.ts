import { PrismicResponse, Story, Contributor } from '../types';
import { articleIdToLabel } from '../fetch';
import { isNotUndefined } from '@weco/common/utils/array';
import { transformImage } from '@weco/common/services/prismic/transformers/images';
import linkResolver from '@weco/common/services/prismic/link-resolver';

export async function transformPrismicResponse(
  edges: PrismicResponse[]
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
      url: linkResolver({ id, type: 'articles' }),
      firstPublicationDate,
      contributors: allContributors,
      type: 'articles' as const,
      summary: image?.caption?.[0].text,
      label: format?._meta
        ? { text: articleIdToLabel(format._meta.id) }
        : { text: 'Article' },
    };
  });

  return results;
}
