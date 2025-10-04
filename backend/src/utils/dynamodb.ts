import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const isLocal = process.env.NODE_ENV !== 'production' || !!process.env.DYNAMODB_ENDPOINT;

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  endpoint: isLocal ? (process.env.DYNAMODB_ENDPOINT || 'http://localhost:8000') : undefined,
  credentials: isLocal
    ? { accessKeyId: 'dummy', secretAccessKey: 'dummy' }
    : undefined,
});

export const ddb = DynamoDBDocumentClient.from(client, {
  marshallOptions: { removeUndefinedValues: true },
});
