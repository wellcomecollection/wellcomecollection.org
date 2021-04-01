import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { callRemoteApi } from '../../../utils/api-caller';

async function unblockAccount(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const {
    query: { userId },
  } = req;
  const { body, status } = await callRemoteApi(
    req,
    res,
    'DELETE',
    `/users/${userId}/lock`
  );
  res.status(status).json(body);
}

export default withApiAuthRequired(unblockAccount);
