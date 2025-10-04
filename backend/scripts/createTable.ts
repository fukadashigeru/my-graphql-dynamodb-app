import AWS from 'aws-sdk';

// DynamoDB Localの設定
const dynamoDb = new AWS.DynamoDB({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
  accessKeyId: 'dummy',
  secretAccessKey: 'dummy'
});

async function createUserTable() {
  try {
    console.log('DynamoDB Localに接続中...');

    // まず接続テスト
    const listResult = await dynamoDb.listTables().promise();
    console.log('✅ 接続成功！現在のテーブル:', listResult.TableNames);

    console.log('Usersテーブルを作成中...');

    const params = {
      TableName: 'Users',
      KeySchema: [
        { AttributeName: 'id', KeyType: 'HASH' }
      ],
      AttributeDefinitions: [
        { AttributeName: 'id', AttributeType: 'S' }
      ],
      BillingMode: 'PAY_PER_REQUEST'
    };

    console.log('テーブル作成パラメータ:', JSON.stringify(params, null, 2));

    const result = await dynamoDb.createTable(params).promise();
    console.log('✅ Usersテーブルが作成されました！');
    console.log('作成結果:', result);

  } catch (error) {
    console.error('❌ エラーの詳細:');
    // console.error('エラーコード:', error instanceof Error ? error.code : '不明');
    console.error('エラーメッセージ:', error instanceof Error ? error.message : '不明');
    console.error('完全なエラー:', error);

    if (error instanceof Error && error.message.includes('ResourceInUseException')) {
      console.log('⚠️ Usersテーブルは既に存在します');
    }
  }
}

createUserTable();
