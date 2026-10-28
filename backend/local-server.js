import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { handler as getBugsHandler } from './src/handlers/getBugs.js';
import { handler as getBugByIdHandler } from './src/handlers/getBugById.js';
import { handler as createBugHandler } from './src/handlers/createBug.js';
import { handler as updateBugHandler } from './src/handlers/updateBug.js';
import { handler as deleteBugHandler } from './src/handlers/deleteBug.js';
import { handler as addNoteHandler } from './src/handlers/addNote.js';
import { handler as getPresignedUrlHandler } from './src/handlers/getPresignedUrl.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Helper to convert Express req to Lambda Proxy event and forward to Lambda handler
const lambdaAdapter = (lambdaHandler) => async (req, res) => {
  const event = {
    httpMethod: req.method,
    path: req.path,
    headers: req.headers,
    queryStringParameters: Object.keys(req.query).length ? req.query : null,
    pathParameters: Object.keys(req.params).length ? req.params : null,
    body: req.body ? JSON.stringify(req.body) : null
  };

  try {
    const result = await lambdaHandler(event);
    const body = result.body ? JSON.parse(result.body) : null;
    
    // Set headers
    if (result.headers) {
      Object.entries(result.headers).forEach(([k, v]) => res.setHeader(k, v));
    }
    
    res.status(result.statusCode || 200).json(body);
  } catch (err) {
    console.error('Local Server Adapter Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// API Routes (matching API Gateway routes)
app.get('/bugs', lambdaAdapter(getBugsHandler));
app.get('/bugs/:id', lambdaAdapter(getBugByIdHandler));
app.post('/bugs', lambdaAdapter(createBugHandler));
app.put('/bugs/:id', lambdaAdapter(updateBugHandler));
app.patch('/bugs/:id', lambdaAdapter(updateBugHandler));
app.delete('/bugs/:id', lambdaAdapter(deleteBugHandler));
app.post('/bugs/:id/notes', lambdaAdapter(addNoteHandler));
app.post('/attachments/presigned-url', lambdaAdapter(getPresignedUrlHandler));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'jira-qa-backend',
    awsServices: {
      lambda: 'Node.js 20.x Handlers',
      dynamoDbTable: process.env.BUGS_TABLE || 'JiraQABugsTable',
      s3Bucket: process.env.ATTACHMENTS_BUCKET || 'jira-qa-bug-attachments'
    }
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🚀 Jira QA AWS Serverless Backend running locally`);
  console.log(`📍 Endpoint: http://localhost:${PORT}`);
  console.log(`📦 DynamoDB Table: ${process.env.BUGS_TABLE || 'JiraQABugsTable'}`);
  console.log(`🪣 S3 Bucket: ${process.env.ATTACHMENTS_BUCKET || 'jira-qa-bug-attachments'}`);
  console.log(`=======================================================`);
});
