const {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
});
const BUCKET_NAME = process.env.BUCKET_NAME;

function getPrismicAuthToken() {
  const token = process.env.PRISMIC_BEARER_TOKEN;

  if (!token) {
    throw new Error('PRISMIC_BEARER_TOKEN environment variable is required');
  }

  return token;
}

async function getPreviousFetchTime() {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'latest-assets.json',
    });

    const response = await s3Client.send(command);
    const body = await response.Body.transformToString();
    const latestInfo = JSON.parse(body);

    console.log(
      `Found previous fetch from ${new Date(latestInfo.fetch_started_at).toISOString()}`
    );
    return latestInfo.fetch_started_at;
  } catch (error) {
    if (error.name === 'NoSuchKey') {
      console.log('No previous fetch found - this is the first run');
      return null;
    }
    throw error;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAllPrismicAssets() {
  const repo = 'wellcomecollection';
  const assetsUrlBase = 'https://asset-api.prismic.io/assets';

  const token = getPrismicAuthToken();

  let allAssets = [];
  let cursor;
  const pageSize = 5000;

  console.log(`Fetching asset list from ${repo}...`);

  do {
    const url = new URL(assetsUrlBase);
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
      const error = new Error(
        `Prismic assets request failed: ${res.status} ${res.statusText}`
      );
      error.statusCode = res.status;
      throw error;
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

  console.log(`Finished: fetched a list of ${allAssets.length} total assets`);
  return allAssets;
}

async function downloadPrismicAssets() {
  try {
    console.log('Starting Prismic assets download...');

    // Get previous fetch time to filter assets
    const previousFetchTime = await getPreviousFetchTime();

    const fetchStartTime = Date.now();
    const assets = await fetchAllPrismicAssets();

    console.log(`Downloaded ${assets.length} assets from Prismic`);

    // Filter assets modified since last fetch
    let filteredAssets = assets;
    if (previousFetchTime) {
      filteredAssets = assets.filter(
        asset => asset.last_modified >= previousFetchTime
      );
      console.log(
        `Filtered to ${filteredAssets.length} assets modified since last fetch`
      );
    }

    // Map filtered assets to only include id and url for next step
    const assetsForDownload = filteredAssets.map(asset => ({
      id: asset.id,
      url: asset.url,
    }));

    // Batch assets into groups of 100 for parallel processing
    const batchSize = 100;
    const batches = [];
    for (let i = 0; i < assetsForDownload.length; i += batchSize) {
      batches.push(assetsForDownload.slice(i, i + batchSize));
    }

    console.log(
      `Created ${batches.length} batches of up to ${batchSize} assets each`
    );

    // Create filename with timestamp
    const timestamp = new Date();
    const filename = `prismic-assets-${timestamp}.json`;

    // Upload main assets file to S3 (all assets, unfiltered)
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: JSON.stringify(assets, null, 2),
      ContentType: 'application/json',
      Metadata: {
        'asset-count': assets.length.toString(),
        'created-at': new Date().toISOString(),
      },
    });

    await s3Client.send(uploadCommand);
    console.log(
      `Successfully uploaded ${assets.length} assets to s3://${BUCKET_NAME}/${filename}`
    );

    // Create and upload latest-assets.json pointer file
    const latestInfo = {
      filename,
      fetch_started_at: fetchStartTime,
    };

    const latestCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: 'latest-assets.json',
      Body: JSON.stringify(latestInfo, null, 2),
      ContentType: 'application/json',
    });

    await s3Client.send(latestCommand);
    console.log(`Updated latest-assets.json pointer to ${filename}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        batches, // Return batched assets for parallel processing
      }),
    };
  } catch (error) {
    console.error('Error creating Prismic assets snapshot:', error);

    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: 'Error creating assets snapshot',
        error: error.message,
      }),
    };
  }
}

exports.handler = async (event, context) => {
  console.log('Prismic list assets Lambda triggered', { event, context });
  return await downloadPrismicAssets();
};
