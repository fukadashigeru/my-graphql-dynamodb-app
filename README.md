# my-graphql-dynamodb-app

TypeScript + Apollo Server + DynamoDB Local を使った学習用プロジェクトです。バックエンドは Express/APollo Server で、フロントエンドは React + Apollo Client で構成されています。DynamoDB Local は Docker Compose で管理します。

## ディレクトリ構成

- `backend/` GraphQL API と DynamoDB 用ユーティリティ
- `frontend/` クライアント（開発中）

以下はバックエンドとフロントエンドの操作手順です。

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

バックエンド起動時に `ensureTables` が DynamoDB 上の `Users` / `Tasks` テーブルを検証し、存在しなければ自動作成します。そのため手動で `npm run create:table` を実行する必要はほとんどありません（手動作成したい場合は後述）。

## フロントエンドのセットアップと起動

```bash
cd frontend
npm install
npm run dev
```

- Vite の開発サーバーが `http://localhost:5173` で立ち上がります。
- GraphQL エンドポイントはバックエンド (`http://localhost:4000/graphql`) を利用します。バックエンドが起動済みであることを確認してください。
- 型チェックや静的解析は `npm run lint`、本番ビルドは `npm run build` で実行できます。
- 画面からは Users / Tasks の一覧取得、Task の作成・更新・削除を Apollo Client のクエリ／ミューテーション経由で行えます。

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
- `npm run create:table` DynamoDB Local に Users / Tasks テーブルを明示的に作成（既に存在する場合はスキップ）

## トラブルシューティング

- DynamoDB Local へ接続できない場合は `npm run docker:up` を再実行し、`npm run test:connection` で疎通確認します。
- コンテナを削除してもテーブルが残らない場合は、`backend/dynamodb-data` ディレクトリがホスト側に作成されているか確認してください。
- フロントエンドがバックエンドと通信できない場合は、`frontend/src` 内の Apollo Client 設定でエンドポイントが `http://localhost:4000/graphql` に向いているか、バックエンドが稼働しているかを確かめてください。
