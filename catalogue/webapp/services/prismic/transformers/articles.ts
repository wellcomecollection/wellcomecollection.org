import { PrismicResponse, Story } from '../types/story';

export async function transformStories(
  allArticless: PrismicResponse
): Promise<Story[]> {
  const { edges } = allArticless;
  const stories = edges.map(edge => {
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
      type: 'Story',
    };
  });
  return stories;
}
