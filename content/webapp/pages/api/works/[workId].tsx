import { NextApiRequest, NextApiResponse } from 'next';

import { getTogglesFromContext } from '@weco/common/server-data/toggles';
import { isString } from '@weco/common/utils/type-guards';
import { getWork } from '@weco/content/services/wellcome/catalogue/works';
import { TogglesResp } from '@weco/toggles';

const WorksApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { workId } = req.query;
  if (!isString(workId)) {
    res.status(404);
    return;
  }

  // As the only toggles we care about here for now are the stagingApi
  // feature flag and the cataloguePipeline mode this is a mega hack to get
  // this working so we can remove toggles from the query
  // TODO : get toggles working here
  const togglesResp: TogglesResp = {
    featureFlags: [
      {
        id: 'stagingApi',
        title: 'Staging API',
        defaultValue: false,
        description: 'Use the staging catalogue API',
        type: 'permanent',
      },
    ],
    tests: [],
    modes: [
      {
        id: 'cataloguePipeline',
        title: 'Catalogue pipeline',
        description:
          'Selects which catalogue pipeline serves works and images requests',
        options: [
          { id: 'default', label: 'Default — normal pipeline setup' },
          { id: 'new-pipeline', label: 'New (Axiell/FOLIO) pipeline' },
        ],
      },
    ],
  };
  const { featureFlags, modes } = getTogglesFromContext(togglesResp, { req });

  const response = await getWork({
    id: workId,
    shouldUseStagingApi: featureFlags.stagingApi,
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
