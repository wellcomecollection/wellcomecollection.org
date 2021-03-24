import { NextApiRequest, NextApiResponse } from 'next';
import { SortField } from '../../interfaces';
import { callRemoteApi } from '../../utils/api-caller';
import * as queryString from 'query-string';

const pageSize = 20;

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const {
    query: {
      page = '1',
      status,
      name,
      email,
      sort = SortField.Name,
      sortDir = '1',
    },
  } = req;

  const p: number = parseInt(page as string) - 1;
  const statusFilterValue = status !== 'any' ? status : undefined;
  const queryParams = queryString.stringify({
    page: p,
    pageSize,
    sort,
    sortDir,
    name,
    email,
    status: statusFilterValue,
  });
  const searchUrl = '/users?' + queryParams;
  const apiResponse = await callRemoteApi(req, res, 'GET', searchUrl);
  res.status(apiResponse.status).json(apiResponse.body);
};
