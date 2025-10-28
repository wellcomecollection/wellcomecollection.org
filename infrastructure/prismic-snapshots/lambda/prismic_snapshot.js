const {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} = require('@aws-sdk/client-s3');
const { createClient, getRepositoryEndpoint } = require('@prismicio/client');

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-west-1',
});
const BUCKET_NAME = process.env.BUCKET_NAME;

function createPrismicClient() {
  const accessToken = process.env.PRISMIC_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error('PRISMIC_ACCESS_TOKEN environment variable is required');
  }

  const endpoint = getRepositoryEndpoint('wellcomecollection');

  return createClient(endpoint, {
    accessToken,
  });
}

async function cleanupOldSnapshots() {
  try {
    console.log('Cleaning up old snapshots...');

    // List all objects in the bucket
    const listCommand = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      Prefix: 'snapshot.',
    });

    const response = await s3Client.send(listCommand);

    if (!response.Contents || response.Contents.length <= 14) {
      console.log(
        `Found ${response.Contents?.length || 0} snapshots, no cleanup needed`
      );
      return;
    }

    // Sort by LastModified date (oldest first)
    const sortedObjects = response.Contents.sort(
      (a, b) => new Date(a.LastModified) - new Date(b.LastModified)
    );

    // Delete objects beyond the 14 most recent
    const objectsToDelete = sortedObjects.slice(0, sortedObjects.length - 14);

    console.log(`Deleting ${objectsToDelete.length} old snapshots`);

    for (const obj of objectsToDelete) {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: obj.Key,
      });

      await s3Client.send(deleteCommand);
      console.log(`Deleted ${obj.Key}`);
    }
  } catch (error) {
    console.error('Error cleaning up old snapshots:', error);
    // Don't fail the main operation if cleanup fails
  }
}

async function downloadPrismicSnapshot() {
  try {
    console.log('Starting Prismic snapshot download...');

    const client = createPrismicClient();

    // Get the master ref
    const masterRef = await client.getMasterRef();
    const refId = masterRef.ref;

    console.log(`Prismic master ref is ${refId}`);

    // Download all documents
    const documents = await client.dangerouslyGetAll();

    console.log(`Downloaded ${documents.length} documents from Prismic`);

    // Create filename with timestamp and ref
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `snapshot.${refId}.${timestamp}.json`;

    // Upload to S3
    const uploadCommand = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: filename,
      Body: JSON.stringify(documents, null, 2),
      ContentType: 'application/json',
      Metadata: {
        'prismic-ref': refId,
        'document-count': documents.length.toString(),
        'created-at': new Date().toISOString(),
      },
    });

    await s3Client.send(uploadCommand);
    console.log(
      `Successfully uploaded snapshot to s3://${BUCKET_NAME}/${filename}`
    );

    // Clean up old snapshots (keep only 14 most recent)
    await cleanupOldSnapshots();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Snapshot created successfully',
        filename,
        refId,
        documentCount: documents.length,
      }),
    };
  } catch (error) {
    console.error('Error creating Prismic snapshot:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error creating snapshot',
        error: error.message,
      }),
    };
  }
}

exports.handler = async (event, context) => {
  console.log('Prismic snapshot Lambda triggered', { event, context });
  return await downloadPrismicSnapshot();
};
