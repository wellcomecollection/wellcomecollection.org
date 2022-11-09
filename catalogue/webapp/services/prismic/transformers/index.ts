import { PrismicResponse, TransformedResponse, ContentType } from '../types';
import { articleIdToLabel } from '../fetch';

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

    return {
      id,
      title: title[0]?.text,
      image: {
        url: image.image?.url,
      },
      url: `https://wellcomecollection.org/${type}/${id}`,
      firstPublicationDate,
      contributors,
      type: type,
      summary: summary,
      label: isArticle && format ? articleIdToLabel(format._meta.id) : null,
    };
  });
  return results;
}
