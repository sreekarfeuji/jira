import { S3AttachmentService } from '../services/s3Service.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Lambda Handler: POST /attachments/presigned-url
 * Generates an Amazon S3 pre-signed upload URL for secure, direct-to-S3 uploads
 * 
 * Body: {
 *   bugId: "BUG-101",
 *   fileName: "crash-log.txt",
 *   contentType: "text/plain",
 *   operation: "upload" | "download",
 *   s3Key?: "attachments/..."
 * }
 */
export const handler = async (event) => {
  try {
    if (!event.body) {
      return errorResponse('Request body is required', 400);
    }

    const body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const operation = body.operation || 'upload';

    if (operation === 'download') {
      if (!body.s3Key) {
        return errorResponse('s3Key is required for download presigned URL', 400);
      }
      const downloadData = await S3AttachmentService.getDownloadPresignedUrl(body.s3Key);
      return successResponse(downloadData);
    }

    // Default: upload presigned URL
    if (!body.bugId || !body.fileName) {
      return errorResponse('Both bugId and fileName are required for upload presigned URL', 400);
    }

    const presignedData = await S3AttachmentService.getUploadPresignedUrl(
      body.bugId,
      body.fileName,
      body.contentType || 'application/octet-stream',
      body.expiresIn || 300
    );

    return successResponse(presignedData);
  } catch (err) {
    console.error('Error generating presigned URL:', err);
    return errorResponse('Failed to generate S3 pre-signed URL', 500, err.message);
  }
};
