import AWS from 'aws-sdk';
import { initMapper } from 'src/utils/mapper';
import clearDb from './clear-db';
import TEST_DB_CONFIG from './config';

const testConn = async (): Promise<void> => {
    AWS.config.update(TEST_DB_CONFIG);

    initMapper();

    await clearDb();
};

export default testConn;
