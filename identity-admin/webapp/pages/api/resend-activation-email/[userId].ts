import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextApiRequest, NextApiResponse } from 'next';
import { callRemoteApi } from '../../../utils/api-caller';

async function resendActivationEmail(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const {
    query: { userId },
  } = req;
  const { body, status } = await callRemoteApi(
    req,
    res,
    'PUT',
    `/users/${userId}/send-verification`
  );
  res.status(status).json(body);
}

export default withApiAuthRequired(resendActivationEmail);
