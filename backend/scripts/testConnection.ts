import AWS from 'aws-sdk';

// DynamoDB Localの設定
const dynamoDb = new AWS.DynamoDB({
  endpoint: 'http://localhost:8000',
  region: 'us-east-1',
  accessKeyId: 'dummy',
  secretAccessKey: 'dummy'
});

async function testConnection() {
  try {
    console.log('DynamoDB Localに接続中...');

    // テーブル一覧を取得
    const result = await dynamoDb.listTables().promise();
    console.log('✅ 接続成功！');
    console.log('テーブル一覧:', result.TableNames);

  } catch (error) {
    console.error('❌ 接続エラー:', error);
  }
}

testConnection();
