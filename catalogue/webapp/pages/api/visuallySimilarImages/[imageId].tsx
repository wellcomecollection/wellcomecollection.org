import { NextApiRequest, NextApiResponse } from 'next';
import { CatalogueApiError } from '@weco/common/model/catalogue';
import hasOwnProperty from '@weco/common/utils/has-own-property';
import { getImage } from 'services/catalogue/images';
import { getTogglesFromContext } from '@weco/common/server-data/toggles';

export function isCatalogueApiError(response: any): response is CatalogueApiError {
  return Boolean(hasOwnProperty(response, 'type') && response.type === 'Error');
}

const VisuallySimilarImagesApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { imageId } = req.query;
  const id = Array.isArray(imageId) ? imageId[0] : imageId;

  // As the only toggle we care about here for now is the stagingApi
  // this is a mega hack to get this working so we can remove toggles from the query
  // TODO : get toggles working here
  const togglesResp = {
    toggles: [
      {
        id: 'stagingApi',
        title: 'Staging API',
        defaultValue: false,
        description: 'Use the staging catalogue API',
      },
    ],
    tests: [],
  };
  const toggles = getTogglesFromContext(togglesResp, { req });

  const response = await getImage({
    id,
    toggles,
    include: ['visuallySimilar'],
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Cache-Control',
    'private, no-cache, no-store, max-age=0, must-revalidate'
  );

  if (isCatalogueApiError(response)) {
    res.status(response.httpStatus);
  } else {
    res.status(200);
  }
  res.json(response);
};

export default VisuallySimilarImagesApi;
