import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3, ATTACHMENTS_BUCKET } from '../config/aws.js';
import { v4 as uuidv4 } from 'uuid';

export class S3AttachmentService {
  /**
   * Generate a pre-signed URL for direct browser-to-S3 upload
   * @param {string} bugId - The ID of the bug (e.g. BUG-101)
   * @param {string} fileName - Original file name (e.g. error-screenshot.png)
   * @param {string} contentType - MIME type (e.g. image/png, application/pdf)
   * @param {number} expiresIn - Expiry in seconds (default 300 = 5 minutes)
   */
  static async getUploadPresignedUrl(bugId, fileName, contentType = 'application/octet-stream', expiresIn = 300) {
    const fileExtension = fileName.includes('.') ? fileName.split('.').pop() : '';
    const uniqueFileId = uuidv4();
    const s3Key = `attachments/${bugId}/${uniqueFileId}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: ATTACHMENTS_BUCKET,
      Key: s3Key,
      ContentType: contentType,
      Metadata: {
        bugId,
        originalName: encodeURIComponent(fileName)
      }
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn });

    return {
      uploadUrl,
      s3Key,
      fileId: uniqueFileId,
      fileName,
      contentType,
      expiresIn,
      bucket: ATTACHMENTS_BUCKET
    };
  }

  /**
   * Generate a pre-signed URL to safely read/download an attachment from S3
   * @param {string} s3Key - S3 object key
   * @param {number} expiresIn - Expiry in seconds (default 900 = 15 minutes)
   */
  static async getDownloadPresignedUrl(s3Key, expiresIn = 900) {
    const command = new GetObjectCommand({
      Bucket: ATTACHMENTS_BUCKET,
      Key: s3Key
    });

    const downloadUrl = await getSignedUrl(s3, command, { expiresIn });
    return { downloadUrl, s3Key, expiresIn };
  }

  /**
   * Delete an attachment from S3
   */
  static async deleteAttachment(s3Key) {
    const command = new DeleteObjectCommand({
      Bucket: ATTACHMENTS_BUCKET,
      Key: s3Key
    });

    await s3.send(command);
    return { s3Key, deleted: true };
  }

  /**
   * List all attachment keys stored for a given bug
   */
  static async listAttachmentsForBug(bugId) {
    const command = new ListObjectsV2Command({
      Bucket: ATTACHMENTS_BUCKET,
      Prefix: `attachments/${bugId}/`
    });

    const response = await s3.send(command);
    return response.Contents || [];
  }
}
