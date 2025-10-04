# my-graphql-dynamodb-app

TypeScript + Apollo Server + DynamoDB Local を使った学習用プロジェクトです。バックエンドは Express で動作し、DynamoDB Local は Docker Compose で管理します。

## ディレクトリ構成

- `backend/` GraphQL API と DynamoDB 用ユーティリティ
- `frontend/` クライアント（開発中）

以下はバックエンド周辺の操作手順です。

## セットアップ

```bash
cd backend
npm install
```

## DynamoDB Local の起動・停止

- 起動: `npm run docker:up`
- 停止: `npm run docker:down`
- 完全削除（ボリューム含む）: `npm run docker:clean`

`docker-compose.yml` では `./dynamodb-data` を `/home/dynamodblocal/data` にマウントしています。コンテナを再起動してもテーブルとデータは保持され、ディレクトリは初回起動時に自動作成されます。

## バックエンドの起動

### 開発モード

```bash
npm run dev
```

### ビルド & 本番相当起動

```bash
npm run build
npm run start
```

バックエンド起動時に `ensureTables` が DynamoDB 上の `Users` テーブルを検証し、存在しなければ自動作成します。そのため手動で `npm run create:table` を実行する必要はありません。

## 動作確認

```bash
curl -X POST http://localhost:4000/graphql \
  -H 'Content-Type: application/json' \
  -d '{"query":"query { listUsers { id name } }"}'
```

GraphQL エンドポイント: `http://localhost:4000/graphql`

## Apollo Sandbox の使い方
`http://localhost:4000/graphql`を開く

### クエリ例
```graphql
query {
  listUsers {
    id
    email
    name
    role
  }
}
```

### ミューテーション例
```graphql
mutation {
  createUser(input: {
    email: "test@example.com"
    name: "テスト太郎"
    age: 28
    role: "user"
  }) {
    id
    email
    name
    createdAt
  }
}
```

## よく使う npm スクリプト

- `npm run docker:up` / `docker:down` / `docker:clean`
- `npm run dev` / `build` / `start`
- `npm run test:connection` DynamoDB への疎通確認（必要に応じて）

## トラブルシューティング

- DynamoDB Local へ接続できない場合は `npm run docker:up` を再実行し、`npm run test:connection` で疎通確認します。
- コンテナを削除してもテーブルが残らない場合は、`backend/dynamodb-data` ディレクトリがホスト側に作成されているか確認してください。
