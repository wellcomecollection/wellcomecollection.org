import { NextApiRequest, NextApiResponse } from 'next';
import { getTogglesFromContext } from '@weco/common/server-data/toggles';
import { getWork } from '@weco/catalogue/services/wellcome/catalogue/works';
import { isString } from '@weco/common/utils/type-guards';

const WorksApi = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { workId } = req.query;
  if (!isString(workId)) {
    res.status(404);
    return;
  }

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

  const response = await getWork({ id: workId, toggles });

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
