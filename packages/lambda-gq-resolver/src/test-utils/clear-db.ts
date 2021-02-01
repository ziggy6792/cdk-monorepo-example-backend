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
        tables = await promiseWithTimeout(dynamodb.listTables().promise(), 10000);
    } catch (err) {
        const errorMessage = "\nTest DB: Local db is not running. Please run 'yarn start' from root dir";
        console.log(`\n${errorMessage}`);
        throw new Error(errorMessage);
    }

    console.log('\nTest DB: Deleteing tables...');

    if (TEST_DB_CONFIG.region !== 'local') {
        console.log('WTF ARE YOU DOING!?');
        return;
    }
    const deleteTableFns = tables.TableNames.map((TableName) => async () => {
        // console.log(`Deleting ${TableName}`);
        try {
            dynamodb
                .deleteTable({
                    TableName,
                })
                .promise();
        } catch (err) {
            console.log(err);
        }
        return `Deleted ${TableName}`;
    });

    const results = await Promise.all(deleteTableFns.map((fn) => fn()));
    console.log(results.join('\n'));
};

export default clearDb;
