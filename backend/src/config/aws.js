import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

dotenv.config();

const region = process.env.AWS_REGION || 'us-east-1';

// DynamoDB Client configuration
const dynamoClientConfig = {
  region,
  ...(process.env.DYNAMODB_ENDPOINT ? { endpoint: process.env.DYNAMODB_ENDPOINT } : {})
};

const rawDynamoClient = new DynamoDBClient(dynamoClientConfig);

// Marshals and unmarshals JavaScript objects automatically
export const dynamoDb = DynamoDBDocumentClient.from(rawDynamoClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true
  },
  unmarshallOptions: {
    wrapNumbers: false
  }
});

// S3 Client configuration
const s3Config = {
  region,
  ...(process.env.S3_ENDPOINT ? { endpoint: process.env.S3_ENDPOINT, forcePathStyle: true } : {})
};

export const s3 = new S3Client(s3Config);

export const BUGS_TABLE = process.env.BUGS_TABLE || 'JiraQABugsTable';
export const ATTACHMENTS_BUCKET = process.env.ATTACHMENTS_BUCKET || 'jira-qa-bug-attachments';
