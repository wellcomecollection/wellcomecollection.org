import { NextApiRequest, NextApiResponse } from 'next';
import { exitPreview } from '@prismicio/next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return exitPreview({ req, res });
}
