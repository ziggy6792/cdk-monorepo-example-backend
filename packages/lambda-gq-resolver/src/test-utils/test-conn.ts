import AWS from 'aws-sdk';
import { initMapper, initTables } from 'src/utils/mapper';
import clearDb, { lsitTables } from './clear-db';
import TEST_DB_CONFIG from './config';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const testConn = async (): Promise<void> => {
    AWS.config.update(TEST_DB_CONFIG);

    initMapper({ region: 'local', tableNamePrefix: 'test-' });

    await clearDb();
    await initTables();
    // await lsitTables();

    // await delay(30000);

    console.log('tables initialized');
};

export default testConn;
