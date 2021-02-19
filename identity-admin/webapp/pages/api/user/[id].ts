import { NextApiRequest, NextApiResponse } from 'next';
import { callRemoteApi } from '../../../utils/api-caller';

async function getUserInfo(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  const user = await callRemoteApi(req, res, 'GET', '/users/' + id);
  res.status(200).json(user.body);
}

async function updateUserInfo(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req;
  const { body, status } = await callRemoteApi(req, res, 'PUT', '/users/' + id);
  res.status(status).json(body);
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  switch (req.method) {
    case 'GET': {
      return getUserInfo(req, res);
    }
    case 'PUT': {
      return updateUserInfo(req, res);
    }
    default: {
      res.status(404);
    }
  }
};
