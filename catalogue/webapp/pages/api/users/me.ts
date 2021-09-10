import type { NextApiRequest, NextApiResponse } from 'next';

const signedOutResp = { message: 'Unauthorized' };
const signedInResp = {
  userId: 1111111,
  barcode: '1111111',
  firstName: 'Naomi Parker',
  lastName: 'Fraley',
  email: 'naomi@wecandoit.com',
  emailValidated: true,
  locked: false,
  creationDate: '2021-08-24T09:58:27.833Z',
  updatedDate: '2021-08-31T13:17:31.363Z',
  lastLoginDate: '2021-08-31T13:17:31.363Z',
  lastLoginIp: '00.000.00.000',
  totalLogins: 20,
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  // This is just for development purposes.
  // /api/users/me is served from the identity webapp
  const signedIn = req.cookies.devSignedIn === 'true';

  if (signedIn) {
    res.status(200).json(signedInResp);
  } else {
    res.status(401).json(signedOutResp);
  }
}
