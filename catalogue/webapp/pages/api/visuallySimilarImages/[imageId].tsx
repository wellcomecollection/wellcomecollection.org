import { NextApiRequest, NextApiResponse } from 'next';
import { CatalogueApiError } from '@weco/common/model/catalogue';
import hasOwnProperty from '@weco/common/utils/has-own-property';
import { getImage } from 'services/catalogue/images';

export function isCatalogueApiError(response: any): response is CatalogueApiError {
  return Boolean(hasOwnProperty(response, 'type') && response.type === 'Error');
}

const VisuallySimilarImagesApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { imageId } = req.query;
  const id = Array.isArray(imageId) ? imageId[0] : imageId;

  // The only toggle we care about is stagingApi.  We get the cookies from
  // the user's session by passing { credentials: 'same-origin' } in the fetch
  // request, then we construct this toggle block directly.
  //
  // It's a bit of a hack and we could do this better, but it works well enough
  // and doesn't introduce too much complexity.
  const toggles = {
    'stagingApi': req.cookies['toggle_stagingApi'] === 'true',
  };

  const response = await getImage({
    id,
    toggles: toggles,
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
