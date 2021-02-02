import AWS from 'aws-sdk';
import { initMapper, initTables } from 'src/utils/mapper';
import clearDb from './clear-db';
import TEST_DB_CONFIG from './config';

const testConn = async (): Promise<void> => {
    AWS.config.update(TEST_DB_CONFIG);

    initMapper();

    await clearDb();
    await initTables();
};

export default testConn;
