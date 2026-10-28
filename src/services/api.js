/**
 * API client for interacting with the AWS Serverless Backend
 * (AWS Lambda + DynamoDB + S3)
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const bugApi = {
  /**
   * Fetch all bugs from backend (DynamoDB via Lambda)
   */
  async getBugs(status = null) {
    const url = status ? `${API_BASE_URL}/bugs?status=${status}` : `${API_BASE_URL}/bugs`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch bugs`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Fetch single bug by ID
   */
  async getBugById(id) {
    const res = await fetch(`${API_BASE_URL}/bugs/${id}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to fetch bug`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Create new bug
   */
  async createBug(bugData) {
    const res = await fetch(`${API_BASE_URL}/bugs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bugData)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to create bug`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Update bug status (qa -> done -> approved) or fields
   */
  async updateBug(id, fields) {
    const res = await fetch(`${API_BASE_URL}/bugs/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(fields)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to update bug`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Delete bug
   */
  async deleteBug(id) {
    const res = await fetch(`${API_BASE_URL}/bugs/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to delete bug`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Append QA Note
   */
  async addNote(id, note) {
    const res = await fetch(`${API_BASE_URL}/bugs/${id}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: Failed to add note`);
    const json = await res.json();
    return json.data;
  },

  /**
   * Upload attachment directly to S3 via pre-signed URL
   */
  async uploadAttachment(bugId, file) {
    // 1. Request presigned URL from Lambda
    const presignedRes = await fetch(`${API_BASE_URL}/attachments/presigned-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bugId,
        fileName: file.name,
        contentType: file.type || 'application/octet-stream',
        operation: 'upload'
      })
    });

    if (!presignedRes.ok) throw new Error('Failed to obtain S3 pre-signed upload URL');
    const { data: presignedData } = await presignedRes.json();

    // 2. Upload file directly to Amazon S3
    const uploadRes = await fetch(presignedData.uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/octet-stream'
      },
      body: file
    });

    if (!uploadRes.ok) throw new Error('Failed to upload attachment directly to S3');

    return {
      fileName: file.name,
      s3Key: presignedData.s3Key,
      bucket: presignedData.bucket
    };
  }
};
