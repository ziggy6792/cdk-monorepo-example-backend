import AWS from 'aws-sdk';
import { initMapper, initTables } from 'src/utils/mapper';
import clearDb from './clear-db';
import TEST_DB_CONFIG from './config';

const testConn = async (): Promise<void> => {
    AWS.config.update(TEST_DB_CONFIG);

    initMapper({ region: 'local', tableNamePrefix: 'test-' });

    await clearDb();
    await initTables();
    console.log('Tables initalized');
};

export default testConn;
