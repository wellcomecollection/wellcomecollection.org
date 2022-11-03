import { PrismicResponse, TransformedResponse, ContentType } from '../types';

export async function transformPrismicResponse(
  type: ContentType[],
  edges: PrismicResponse[]
): Promise<TransformedResponse[]> {
  const results = edges.map(edge => {
    const { node } = edge;
    const { title, contributors, body, promo, _meta } = node;
    const { primary: standfirst } = body[0];
    const { primary: image } = promo[0];
    const { id, firstPublicationDate } = _meta;
    const summary = standfirst.text[0].text;
    return {
      id,
      title: title[0]?.text,
      image: {
        url: image.image?.url,
      },
      url: `https://wellcomecollection.org/articles/${id}`,
      firstPublicationDate,
      contributors,
      type: type,
      summary: summary,
    };
  });
  return results;
}
