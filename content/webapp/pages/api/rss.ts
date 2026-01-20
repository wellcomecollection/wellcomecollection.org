import { NextApiRequest, NextApiResponse } from 'next';

import { buildStoriesRss } from '@weco/content/utils/rss';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const rss = await buildStoriesRss(req);
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(rss);
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    res.setHeader('Content-Type', 'application/xml');
    res.status(500).send('<error>Failed to generate RSS feed</error>');
  }
};

export default handler;
