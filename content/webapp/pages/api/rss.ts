import { NextApiRequest, NextApiResponse } from 'next';

import { buildStoriesRss } from '@weco/content/utils/rss';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const rss = await buildStoriesRss(req);
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(rss);
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.status(500).json({ error: 'Failed to generate RSS feed' });
  }
};

export default handler;
