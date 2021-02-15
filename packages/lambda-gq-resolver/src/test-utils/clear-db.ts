import AWS, { DynamoDB } from 'aws-sdk';
import TEST_DB_CONFIG from './config';

// const promiseWithTimeout = function (promise: Promise<any>, ms: number) {
//     // Create a promise that rejects in <ms> milliseconds
//     const timeout = new Promise((resolve, reject) => {
//         const id = setTimeout(() => {
//             clearTimeout(id);
//             reject(new Error(`Timed out in ${ms}ms.`));
//         }, ms);
//     });

//     // Returns a race between our timeout and the passed in promise
//     return Promise.race([promise, timeout]);
// };

const dynamodb = new AWS.DynamoDB(TEST_DB_CONFIG);

const getRecordKeys = async (tableName: string, hashKeys: string[]) => {
    const ExpressionAttributeNames = {};

    hashKeys.forEach((key) => {
        ExpressionAttributeNames[`#${key}`] = key;
    });

    const ProjectionExpression = Object.keys(ExpressionAttributeNames).join(',');

    return dynamodb
        .scan({
            TableName: tableName,
            ExpressionAttributeNames,
            ProjectionExpression,
            Select: 'SPECIFIC_ATTRIBUTES',
        })
        .promise();
};

const getKeys = async (tableName: string) => {
    const tableData = await dynamodb.describeTable({ TableName: tableName }).promise();

    return tableData.Table.KeySchema.filter(({ KeyType }) => ['HASH', 'RANGE'].includes(KeyType)).map(({ AttributeName }) => AttributeName);
};

const deleteItem = async (tableName: string, key: any) => {
    console.log('deleting item', key);
    dynamodb.deleteItem({ TableName: tableName, Key: key }).promise();
};

const purgeTable = async function (tableName: string) {
    const keys = await getKeys(tableName);

    const deleteAllRecords = async function () {
        // console.log('records', records);

        const records = await getRecordKeys(tableName, keys);

        const deleteFns = records.Items.map((item) => async () => deleteItem(tableName, item));
        await Promise.all(deleteFns.map((fn) => fn()));
        if (records.Items.length > 0) {
            await deleteAllRecords(); // Will call the same function over and over
        }
    };

    await deleteAllRecords();
};

const clearDb = async (): Promise<void> => {
    let tables: DynamoDB.ListTablesOutput;
    try {
        tables = await dynamodb.listTables().promise();
    } catch (err) {
        const errorMessage = "\nTest DB: Local db is not running. Please run 'yarn start' from root dir";
        console.log(`\n${errorMessage}`);
        throw new Error(errorMessage);
    }

    console.log('\nTest DB: Purging tables...');

    if (TEST_DB_CONFIG.region !== 'local') {
        console.log('WTF ARE YOU DOING!?');
        return;
    }
    const deleteTableFns = tables.TableNames.map((TableName) => async () => {
        // console.log(`Deleting ${TableName}`);
        try {
            // await dynamodb
            //     .deleteTable({
            //         TableName,
            //     })
            //     .promise();
            await purgeTable(TableName);
        } catch (err) {
            console.log(err);
        }
        return `Purged ${TableName}`;
    });

    const results = await Promise.all(deleteTableFns.map((fn) => fn()));
    // eslint-disable-next-line no-console
    console.log(results.join('\n'));
};

export default clearDb;
