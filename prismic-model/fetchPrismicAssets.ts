import 'dotenv/config';
import { writeFileSync } from 'fs';
import { join } from 'path';

interface AssetMetadata {
  [key: string]: unknown;
}

function getPrismicAuthToken(): string {
  const token = process.env.PRISMIC_BEARER_TOKEN_STAGE; // TODO switch to prod

  if (!token) {
    throw new Error(
      'PRISMIC_BEARER_TOKEN_STAGE environment variable is required'
    );
  }

  return token;
}

function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function fetchAllPrismicAssets(): Promise<AssetMetadata[]> {
  const repo = 'wellcomecollection-stage'; // TODO switch to 'wellcomecollection'
  const assetsUrlBase = `https://asset-api.prismic.io/assets`;

  const token = getPrismicAuthToken();

  let allAssets: AssetMetadata[] = [];
  let cursor: string | undefined;
  const pageSize = 5000;

  console.log(`Fetching asset list from ${repo}...`);

  do {
    const url = new URL(`${assetsUrlBase}`);
    url.searchParams.set('repository', repo);
    url.searchParams.set('limit', pageSize.toString());
    if (cursor) {
      url.searchParams.set('cursor', cursor);
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      repository: repo,
    };

    console.log(`Fetching page (cursor: ${cursor || 'initial'})...`);
    const res = await fetch(url.toString(), { headers });
    if (!res.ok) {
      throw new Error(
        `Prismic assets request failed: ${res.status} ${res.statusText}`
      );
    }

    const json = await res.json();
    // The Asset API returns { total, items, cursor }
    if (Array.isArray(json.items) && json.items.length > 0) {
      allAssets = allAssets.concat(json.items);
      console.log(
        `Fetched ${json.items.length} assets (total so far: ${allAssets.length} / ${json.total})`
      );
    }

    cursor = json.cursor;

    // Delay between requests to be nice to the Prismic API and avoid rate limiting
    if (cursor) {
      await delay(1000);
    }
  } while (cursor);

  console.log(`Finished: fetched  a list of ${allAssets.length} total assets`);

  // Save to file
  const outputPath = join(__dirname, 'prismic-assets.json');
  writeFileSync(outputPath, JSON.stringify(allAssets, null, 2), 'utf-8');
  console.log(`Saved assets to ${outputPath}`);

  return allAssets;
}

// CLI runner
if (require.main === module) {
  fetchAllPrismicAssets()
    .then(assets => {
      console.log('Fetched', assets.length, 'assets');
    })
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}
