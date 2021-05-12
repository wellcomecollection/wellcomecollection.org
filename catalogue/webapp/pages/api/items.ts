import fetch from 'isomorphic-unfetch';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const { id } = req.query;
  const items = await fetch(
    `https://api.wellcomecollection.org/catalogue/v2/works/${id}/items`,
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ITEMS_API_KEY,
      },
    }
  ).then(resp => resp.json());

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(items);
};
