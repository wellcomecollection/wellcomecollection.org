import {
  PrismicResponse,
  TransformedResponse,
  ContentType,
  Contributor,
} from '../types';
import { articleIdToLabel } from '../fetch';

export async function transformPrismicResponse(
  type: ContentType[],
  edges: PrismicResponse[]
): Promise<TransformedResponse[]> {
  const results = edges.map(edge => {
    console.dir(edge, { depth: null });
    const { node } = edge;
    const { title, contributors, promo, _meta, format } = node;
    const { id, firstPublicationDate } = _meta;
    const { primary: image } = promo[0];
    const summary = image.caption[0].text;
    const isArticle = type.includes('articles');
    const allContributors = contributors.map(contributor => {
      const { contributor: contributorNode }: Contributor = contributor;
      const { name } = contributorNode;
      return name;
    });

    return {
      id,
      title: title[0]?.text,
      image: {
        url: image.image?.url,
      },
      url: `https://wellcomecollection.org/${type}/${id}`,
      firstPublicationDate,
      contributors: contributors ? allContributors : [],
      type: type,
      summary: summary,
      label: isArticle && format ? articleIdToLabel(format._meta.id) : null,
    };
  });
  return results;
}
