const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
});
const BUCKET_NAME = process.env.BUCKET_NAME;

async function downloadAsset(url, retryCount = 0) {
  const maxRetries = 1;

  try {
    console.log(`Downloading: ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      // Don't retry 404s - asset doesn't exist
      if (response.status === 404) {
        console.log(`Asset not found (404): ${url}`);
        return { success: false, error: '404 Not Found', url };
      }

      // Retry other errors once
      if (retryCount < maxRetries) {
        console.log(
          `Failed to download (${response.status}), retrying: ${url}`
        );
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
        return downloadAsset(url, retryCount + 1);
      }

      const error = new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
      error.statusCode = response.status;
      throw error;
    }

    const buffer = await response.arrayBuffer();
    return { success: true, buffer, url };
  } catch (error) {
    // Retry network errors once
    if (retryCount < maxRetries) {
      console.log(`Network error, retrying: ${url}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      return downloadAsset(url, retryCount + 1);
    }

    console.error(
      `Failed to download after ${maxRetries + 1} attempts: ${url}`,
      error
    );
    return { success: false, error: error.message, url };
  }
}

async function uploadToS3(id, buffer, url) {
  try {
    // Extract filename from URL (already contains the ID)
    const urlPath = new URL(url).pathname;
    const filename = urlPath.split('/').pop() || id;
    const key = `assets/${filename}`;

    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: Buffer.from(buffer),
      Metadata: {
        'prismic-asset-id': id,
        'original-url': url,
      },
    });

    await s3Client.send(uploadCommand);
    console.log(`Uploaded: ${key}`);
    return { success: true, key, id };
  } catch (error) {
    console.error(`Failed to upload ${id} to S3:`, error);
    return { success: false, error: error.message, id, url };
  }
}

async function processAssetBatch(batch) {
  const results = {
    total: batch.length,
    successful: 0,
    failed: 0,
    errors: [],
  };

  for (const asset of batch) {
    const { id, url } = asset;

    // Download the asset
    const downloadResult = await downloadAsset(url);

    if (!downloadResult.success) {
      results.failed++;
      results.errors.push({
        id,
        url,
        stage: 'download',
        error: downloadResult.error,
      });
      continue;
    }

    // Upload to S3
    const uploadResult = await uploadToS3(id, downloadResult.buffer, url);

    if (!uploadResult.success) {
      results.failed++;
      results.errors.push({
        id,
        url,
        stage: 'upload',
        error: uploadResult.error,
      });
      continue;
    }

    results.successful++;
  }

  return results;
}

exports.handler = async (event, context) => {
  console.log('Download Prismic assets Lambda triggered', { event, context });

  try {
    // Event contains a batch of assets to download
    const batch = event.batch;

    if (!Array.isArray(batch)) {
      throw new Error('Invalid input: batch must be an array of assets');
    }

    console.log(`Processing batch of ${batch.length} assets`);

    const results = await processAssetBatch(batch);

    console.log(
      `Completed: ${results.successful} successful, ${results.failed} failed`
    );

    return {
      statusCode: results.failed > 0 ? 207 : 200, // 207 Multi-Status if partial success
      body: JSON.stringify(results),
    };
  } catch (error) {
    console.error('Error processing asset batch:', error);

    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify({
        message: 'Error processing asset batch',
        error: error.message,
      }),
    };
  }
};
