import { PrismicResponse, TransformedResponse, ContentType } from '../types';

export async function transformPrismicResponse(
  type: ContentType[],
  edges: PrismicResponse[]
): Promise<TransformedResponse[]> {
  const results = edges.map(edge => {
    const { node } = edge;
    const { title, contributors, body, promo, _meta } = node;
    console.log(body, 'what is the body');
    const { primary: standfirst } = body[0];
    const { primary: image } = promo[0];
    const { id, firstPublicationDate } = _meta;
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
      summary: standfirst?.text[0]?.text,
    };
  });
  return results;
}
