import { NextApiRequest, NextApiResponse } from 'next';

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  console.log('hmmmm.....');
  res.status(200).send('ok');
};

export default handler;
