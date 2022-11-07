import { PrismicResponse, TransformedResponse, ContentType } from '../types';

export async function transformPrismicResponse(
  type: ContentType[],
  edges: PrismicResponse[]
): Promise<TransformedResponse[]> {
  const results = edges.map(edge => {
    const { node } = edge;
    const { title, contributors, promo, _meta } = node;
    const { primary: image } = promo[0];
    const { id, firstPublicationDate } = _meta;
    const summary = image.caption[0].text;

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
    };
  });
  return results;
}
