import { NextApiRequest, NextApiResponse } from 'next';

import { getCachedToggles } from '@weco/common/server-data';
import { getTogglesFromContext } from '@weco/common/server-data/toggles';
import { isString } from '@weco/common/utils/type-guards';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';

const WorksApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { workId } = req.query;
  if (!isString(workId)) {
    res.status(404);
    return;
  }

  const togglesResp = await getCachedToggles();
  const { featureFlags } = getTogglesFromContext(togglesResp, { req });

  // Fallback to cookie if toggle config is missing (e.g., cache load failed)
  const shouldUseStagingApi =
    featureFlags.stagingApi ?? req.cookies.toggle_stagingApi === 'true';

  const response = await getWork({
    id: workId,
    shouldUseStagingApi,
  });

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (response.type === 'Error') {
    res.status(response.httpStatus);
  } else {
    res.status(200);
  }
  res.json(response);
};

export default WorksApi;
