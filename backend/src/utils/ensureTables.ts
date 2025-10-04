import {
  CreateTableCommand,
  DescribeTableCommand,
  waitUntilTableExists,
} from '@aws-sdk/client-dynamodb';

import { dynamoClient } from './dynamodb';

const USERS_TABLE_NAME = process.env.USERS_TABLE_NAME ?? 'Users';

export async function ensureTables(): Promise<void> {
  await ensureUsersTable();
}

async function ensureUsersTable(): Promise<void> {
  try {
    await dynamoClient.send(
      new DescribeTableCommand({ TableName: USERS_TABLE_NAME }),
    );
  } catch (error) {
    if (!isResourceNotFoundError(error)) {
      throw error;
    }

    await dynamoClient.send(
      new CreateTableCommand({
        TableName: USERS_TABLE_NAME,
        KeySchema: [{ AttributeName: 'id', KeyType: 'HASH' }],
        AttributeDefinitions: [{ AttributeName: 'id', AttributeType: 'S' }],
        BillingMode: 'PAY_PER_REQUEST',
      }),
    );

    await waitUntilTableExists(
      { client: dynamoClient, maxWaitTime: 20 },
      { TableName: USERS_TABLE_NAME },
    );
  }
}

function isResourceNotFoundError(error: unknown): boolean {
  return Boolean(
    error &&
      typeof error === 'object' &&
      'name' in error &&
      (error as { name?: string }).name === 'ResourceNotFoundException',
  );
}
