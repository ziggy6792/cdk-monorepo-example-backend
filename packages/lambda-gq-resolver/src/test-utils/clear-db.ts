import AWS, { DynamoDB } from 'aws-sdk';
import TEST_DB_CONFIG from './config';

const clearDb = async (): Promise<void> => {
    const dynamodb = new AWS.DynamoDB(TEST_DB_CONFIG);
    let tables: DynamoDB.ListTablesOutput;
    try {
        tables = await dynamodb.listTables().promise();
    } catch (err) {
        console.log('\nTest DB: Local db is not running');
        throw new Error('Local db is not running');
    }

    console.log('\nTest DB: Deleteing tables...');

    if (TEST_DB_CONFIG.region !== 'local') {
        console.log('WTF ARE YOU DOING!?');
        return;
    }
    const deleteTableFns = tables.TableNames.map((TableName) => async () => {
        console.log(`Deleting ${TableName}`);
        return dynamodb
            .deleteTable({
                TableName,
            })
            .promise();
    });

    await Promise.all(deleteTableFns.map((fn) => fn()));
};

export default clearDb;
