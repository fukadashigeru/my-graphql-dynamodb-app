// backend/src/resolvers/index.ts
import { ddb } from '../utils/dynamodb';
import {
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuid } from 'uuid';

const TABLE = process.env.USERS_TABLE_NAME ?? 'Users';
const TASKS_TABLE = process.env.TASKS_TABLE_NAME ?? 'Tasks';

const nowIso = () => new Date().toISOString();

function buildUpdateExpression(input: Record<string, unknown>) {
  const names: Record<string, string> = {};
  const values: Record<string, unknown> = {};
  const sets: string[] = [];

  Object.entries(input).forEach(([key, value]) => {
    if (value !== undefined) {
      names[`#${key}`] = key;
      values[`:${key}`] = value;
      sets.push(`#${key} = :${key}`);
    }
  });

  return { names, values, sets };
}

export const resolvers = {
  Query: {
    listUsers: async (_: unknown, args: { limit?: number }) => {
      const limit = args?.limit ?? 50;
      const cmd = new ScanCommand({ TableName: TABLE, Limit: limit });
      const res = await ddb.send(cmd);
      return res.Items ?? [];
    },

    getUser: async (_: unknown, args: { id: string }) => {
      const cmd = new GetCommand({ TableName: TABLE, Key: { id: args.id } });
      const res = await ddb.send(cmd);
      return res.Item ?? null;
    },

    getUserByEmail: async (_: unknown, args: { email: string }) => {
      // 学習目的のためScan + Filterで実装（本番はGSI推奨）
      const cmd = new ScanCommand({
        TableName: TABLE,
        FilterExpression: '#email = :email',
        ExpressionAttributeNames: { '#email': 'email' },
        ExpressionAttributeValues: { ':email': args.email },
        Limit: 1,
      });
      const res = await ddb.send(cmd);
      return res.Items?.[0] ?? null;
    },

    listTasks: async () => {
      const res = await ddb.send(new ScanCommand({ TableName: TASKS_TABLE }));
      return res.Items ?? [];
    },

    getTask: async (_: unknown, args: { id: string }) => {
      const res = await ddb.send(
        new GetCommand({ TableName: TASKS_TABLE, Key: { id: args.id } }),
      );
      return res.Item ?? null;
    },
  },

  Mutation: {
    createUser: async (_: unknown, args: { input: any }) => {
      const now = new Date().toISOString();
      const item = {
        id: uuid(),
        email: args.input.email,
        name: args.input.name,
        age: args.input.age ?? null,
        isActive: args.input.isActive ?? true,
        role: args.input.role,
        hoge: args.input.hoge ?? null,
        createdAt: now,
        updatedAt: now,
      };
      await ddb.send(new PutCommand({ TableName: TABLE, Item: item }));
      return item;
    },

    updateUser: async (_: unknown, args: { id: string; input: Record<string, unknown> }) => {
      const now = new Date().toISOString();
      const input = { ...args.input };

      const names: Record<string, string> = {};
      const values: Record<string, unknown> = {};
      const sets: string[] = [];

      Object.entries(input).forEach(([k, v]) => {
        if (v !== undefined) {
          names['#' + k] = k;
          values[':' + k] = v;
          sets.push(`#${k} = :${k}`);
        }
      });

      names['#updatedAt'] = 'updatedAt';
      values[':updatedAt'] = now;
      sets.push('#updatedAt = :updatedAt');

      const cmd = new UpdateCommand({
        TableName: TABLE,
        Key: { id: args.id },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      });

      const res = await ddb.send(cmd);
      return res.Attributes!;
    },

    deleteUser: async (_: unknown, args: { id: string }) => {
      await ddb.send(new DeleteCommand({ TableName: TABLE, Key: { id: args.id } }));
      return true;
    },

    createTask: async (_: unknown, args: { input: { title: string; content?: string; completed?: boolean } }) => {
      const now = nowIso();
      const item = {
        id: uuid(),
        title: args.input.title,
        content: args.input.content ?? null,
        completed: args.input.completed ?? false,
        createdAt: now,
        updatedAt: now,
      };
      await ddb.send(new PutCommand({ TableName: TASKS_TABLE, Item: item }));
      return item;
    },

    updateTask: async (_: unknown, args: { id: string; input: { title?: string; content?: string; completed?: boolean } }) => {
      const { names, values, sets } = buildUpdateExpression(args.input);
      const now = nowIso();

      names['#updatedAt'] = 'updatedAt';
      values[':updatedAt'] = now;
      sets.push('#updatedAt = :updatedAt');

      const cmd = new UpdateCommand({
        TableName: TASKS_TABLE,
        Key: { id: args.id },
        UpdateExpression: `SET ${sets.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      });

      const res = await ddb.send(cmd);
      return res.Attributes!;
    },

    deleteTask: async (_: unknown, args: { id: string }) => {
      await ddb.send(new DeleteCommand({ TableName: TASKS_TABLE, Key: { id: args.id } }));
      return true;
    },
  },
};
