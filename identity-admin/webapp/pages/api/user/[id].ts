import { NextApiRequest, NextApiResponse } from 'next';
import { callRemoteApi } from '../../../utils/api-caller';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req;
  const user = await callRemoteApi(req, res, 'GET', '/users/' + id);
  console.log("Get user status: " + user.status);
  res.status(200).json(user.body);
}
