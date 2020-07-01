// @flow
import fetch from 'isomorphic-unfetch';

type SimilarityMeasure = 'palette' | 'feature';

const ROOT_URL = 'https://labs.wellcomecollection.org';
const SIMILARITY_MEASURE: { [key: SimilarityMeasure]: string } = {
  palette: 'palette-similarity',
  feature: 'feature-similarity',
};

export type SimilarImage = {|
  id: string,
  uri: string,
  workId: string,
|};

export const getSimilarImages = async ({
  id,
  n = 5,
  measure = 'feature',
}: {|
  id: string,
  n?: number,
  measure?: SimilarityMeasure,
|}): Promise<SimilarImage[]> => {
  const res = await fetch(
    `${ROOT_URL}/${SIMILARITY_MEASURE[measure]}/works/${id}?n=${n}`
  );
  if (!res.ok) {
    return [];
  }
  try {
    const data = await res.json();
    return data.neighbours.map(neighbour => ({
      id: neighbour.catalogue_id,
      uri: neighbour.miro_uri,
      workId: neighbour.catalogue_id,
    }));
  } catch (e) {
    return [];
  }
};
