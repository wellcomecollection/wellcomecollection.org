// @flow
import fetch from 'isomorphic-unfetch';

const ROOT_URL = 'https://labs.wellcomecollection.org/palette-api';

export type SimilarImage = {|
  id: string,
  miroId: string,
  workUri: string,
  miroUri: string,
|};

export const getSimilarPaletteImages = async (
  id: string,
  n: number = 5
): Promise<SimilarImage[]> => {
  const res = await fetch(`${ROOT_URL}/works/${id}?n=${n}`);
  if (!res.ok) {
    return [];
  }
  try {
    const data = await res.json();
    return data.neighbours.map(neighbour => ({
      id: neighbour.catalogue_id,
      miroId: neighbour.miro_id,
      workUri: neighbour.catalogue_uri,
      miroUri: neighbour.miro_uri,
    }));
  } catch (e) {
    return [];
  }
};
