import { DynamoBugService } from '../services/dynamoService.js';

/**
 * Lambda Event Handler: S3 ObjectCreated Trigger
 * Triggered automatically when an attachment is successfully uploaded to the S3 bucket.
 * Extracts the bugId and file metadata and updates the DynamoDB bug record.
 */
export const handler = async (event) => {
  console.log('Received S3 Event:', JSON.stringify(event, null, 2));

  for (const record of event.Records || []) {
    try {
      const bucketName = record.s3.bucket.name;
      const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
      const objectSize = record.s3.object.size;

      // Key format: attachments/{bugId}/{fileId}-{fileName}
      const parts = objectKey.split('/');
      if (parts.length >= 3 && parts[0] === 'attachments') {
        const bugId = parts[1];
        const rawFileName = parts.slice(2).join('/');
        // Extract original filename after UUID prefix
        const fileName = rawFileName.replace(/^[0-9a-fA-F-]+_?/, '');

        const attachmentMetadata = {
          s3Key: objectKey,
          bucket: bucketName,
          fileName: fileName || rawFileName,
          sizeBytes: objectSize,
          uploadedAt: record.eventTime || new Date().toISOString()
        };

        console.log(`Associating attachment ${objectKey} with Bug ${bugId}`);
        await DynamoBugService.addAttachment(bugId, attachmentMetadata);
      }
    } catch (err) {
      console.error('Error processing S3 record:', err);
    }
  }

  return { status: 'complete' };
};
