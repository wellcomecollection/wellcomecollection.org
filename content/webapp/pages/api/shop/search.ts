import { NextApiRequest, NextApiResponse } from 'next';

import { predictiveSearch } from '@weco/content/services/shopify';

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const query = typeof req.query.query === 'string' ? req.query.query : '';

  if (!query.trim()) {
    res.status(200).json({ results: [] });
    return;
  }

  try {
    const results = await predictiveSearch(query.trim());
    res.status(200).json({ results });
  } catch (error) {
    console.error('Predictive search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
};

export default handler;
