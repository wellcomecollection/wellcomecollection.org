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
    const { id, lastPublicationDate } = _meta;
    return {
      id,
      lastPublicationDate,
      title,
      contributors,
      standfirst,
      image,
      type: type,
    };
  });
  return results;
}
