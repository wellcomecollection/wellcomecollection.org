import { NextApiRequest, NextApiResponse } from 'next';

import { getCachedToggles } from '@weco/common/server-data';
import { getTogglesFromContext } from '@weco/common/server-data/toggles';
import { isString } from '@weco/common/utils/type-guards';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { resolveApiEnvironment } from '@weco/content/utils/api-environment';

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
  const { modes } = getTogglesFromContext(togglesResp, { req });

  const response = await getWork({
    id: workId,
    apiEnvironment: resolveApiEnvironment({ modes }),
    pipelineCluster: modes.cataloguePipeline ?? undefined,
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
