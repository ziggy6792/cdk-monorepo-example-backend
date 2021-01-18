import AWS, { DynamoDB } from 'aws-sdk';
import TEST_DB_CONFIG from './config';

const promiseWithTimeout = function (promise: Promise<any>, ms: number) {
    // Create a promise that rejects in <ms> milliseconds
    const timeout = new Promise((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(new Error(`Timed out in ${ms}ms.`));
        }, ms);
    });

    // Returns a race between our timeout and the passed in promise
    return Promise.race([promise, timeout]);
};

const clearDb = async (): Promise<void> => {
    const dynamodb = new AWS.DynamoDB(TEST_DB_CONFIG);
    let tables: DynamoDB.ListTablesOutput;
    try {
        tables = await promiseWithTimeout(dynamodb.listTables().promise(), 1000);
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
