// @flow
import fetch from 'isomorphic-unfetch';

type SimilarityMetric = 'palette' | 'feature';

const ROOT_URL = 'https://labs.wellcomecollection.org';
const SIMILARITY_METRIC: { [key: SimilarityMetric]: string } = {
  palette: 'palette-api',
  feature: 'feature-similarity',
};

export type SimilarImage = {|
  id: string,
  miroId: string,
  workUri: string,
  miroUri: string,
|};

export const getSimilarImages = async ({
  id,
  n = 5,
  metric = 'feature',
}: {|
  id: string,
  n?: number,
  metric?: SimilarityMetric,
|}): Promise<SimilarImage[]> => {
  const res = await fetch(
    `${ROOT_URL}/${SIMILARITY_METRIC[metric]}/works/${id}?n=${n}`
  );
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
