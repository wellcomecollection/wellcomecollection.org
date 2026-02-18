import * as fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import * as path from 'path';

/**
 * Shared handler to serve environment-specific robots.txt
 * Strategy: Different robots.txt files per environment
 * - Production: Allow crawlers (except specific bots)
 * - Stage/Dev: Block all crawlers
 */
export default function handleRobotsTxt(
  req: NextApiRequest,
  res: NextApiResponse
): void {
  // Get environment from APM_ENVIRONMENT variable (set in terraform)
  // Defaults to 'dev' for local development
  const environment = process.env.APM_ENVIRONMENT || 'dev';

  // Determine which robots file to use
  let robotsFile: string;
  switch (environment) {
    case 'prod':
      robotsFile = 'robots.prod.txt';
      break;
    case 'stage':
      robotsFile = 'robots.stage.txt';
      break;
    case 'e2e':
    case 'dev':
    default:
      robotsFile = 'robots.dev.txt';
      break;
  }

  // Read the appropriate robots file from the config directory
  const robotsPath = path.join(
    process.cwd(),
    '..',
    '..',
    'config',
    'robots',
    robotsFile
  );

  try {
    const robotsContent = fs.readFileSync(robotsPath, 'utf8');

    // Set appropriate headers
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');

    res.status(200).send(robotsContent);
  } catch (error) {
    console.error(`Failed to read robots.txt file: ${robotsPath}`, error);

    // Fallback: block all crawlers if we can't read the file
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.status(200).send('User-agent: *\nDisallow: /');
  }
}
